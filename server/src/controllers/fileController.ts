import { Request, Response } from "express";
import { loadTextFromBuffer } from "../libs/parseFileToText.js";
import { embedAndStoreChunks } from "../libs/embedAndStoreChunks.js";
import File from "../models/File.js";
import Project from "../models/Project.js";
import { pineconeIndex } from "../config/PineconeClient.js";
import User from "../models/User.js";



export async function uploadTextBlock(req: Request, res: Response){
    try{

         const userId = (req as any).user?.id;
         const { projectId, content, name } = req.body;

     if (!userId || !projectId || !content) {
      return res.status(400).json({success: false, message: 'Missing required fields.' });
    }

    const project = await Project.findById(projectId);

       if (!project || project.userId.toString() !== userId) {
      return res.status(404).json({success: false,  message: 'Project not found or unauthorized.' });
    }

    const fileMeta = await File.create({
        userId,
        projectId,
        name: name || 'Text Block',
        fileType: 'text',
         sizeKB: Math.ceil(content.length / 1024)
    })

    await embedAndStoreChunks(content, {
         namespace: project.namespace,
        fileId: fileMeta._id.toString(),
        projectId: project._id.toString(),
        userId
    })

    await Promise.all([
      User.findByIdAndUpdate(userId, { $inc: { 'usage.filesUploaded': 1 } }),
      Project.findByIdAndUpdate(projectId, { $inc: { totalFiles: 1 } }),
    ]);


      return res.status(201).json({
      success: true,
      message: 'Text uploaded and embedded successfully',
      file: fileMeta
    });

    }catch(error){
           console.error('Upload text block error:', error);
           return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}




export async function uploadFileBlock(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.body;
    const file = (req as any).file;

    

    if (!userId || !projectId || !file) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // 🔒 Check authorization
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized or project not found' });
    }

    // ✅ Extract raw text from file buffer
    const rawText = await loadTextFromBuffer(file.buffer, file.originalname);

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'File has no extractable text content.',
      });
    }

    // ✅ Save file metadata
    const fileMeta = await File.create({
      userId,
      projectId,
      name: file.originalname,
      fileType: file.mimetype,
      sizeKB: Math.ceil(file.size / 1024),
    });

    // 🤖 Embed and store content
    await embedAndStoreChunks(rawText, {
      namespace: project.namespace,
      fileId: fileMeta._id.toString(),
      projectId,
      userId,
    });

    await Promise.all([
      User.findByIdAndUpdate(userId, { $inc: { 'usage.filesUploaded': 1 } }),
      Project.findByIdAndUpdate(projectId, { $inc: { totalFiles: 1 } }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      file: fileMeta,
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}



export async function getAllFiles(req : Request, res: Response){

try{
  const userId = (req as any).user?.id;
  const {projId} = req.body

  
  
  if (!userId){
    return res.status(400).json({success: false, message: 'Missing required fields.' });
  }

  const files = await File.find({userId, projectId: projId})

  

  return res.status(200).json({success: true, data: files});

}catch(error){
  console.error('getAllFiles error:', error);
   return res.status(500).json({ success: false, message: 'Internal server error' });
}

}



export async function deleteFile(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const { fileId } = req.body;

    // Validate input
    if (!userId || !fileId) {
      return res.status(400).json({ success: false, message: 'Missing userId or fileId.' });
    }

    // Fetch file metadata from MongoDB
    const file = await File.findById(fileId).populate('projectId');
    if (!file || file.userId.toString() !== userId) {
      return res.status(404).json({ success: false, message: 'File not found or unauthorized.' });
    }

 
    const project = file.projectId;
    
    const namespace = (project as any).namespace;
    if (!namespace) {
      return res.status(500).json({ success: false, message: 'Project namespace not found.' });
    }


    const indexNs = pineconeIndex.namespace(namespace);


    const vectorIdPrefix = `chunk_${fileId}_`;
    const allVectorIds = [];

    try {

      const result = await indexNs.query({
        topK: 1000, 
        vector: new Array(384).fill(0), 
        includeMetadata: true,
      });

      // Filter vectors by prefix
      const vectorIds = result.matches
        .filter(match => match.id.startsWith(vectorIdPrefix))
        .map(match => match.id);
      allVectorIds.push(...vectorIds);
    } catch (pineconeError) {
      return res.status(500).json({ success: false, message: 'Failed to query vectors from Pinecone.' });
    }

    // Delete vectors from Pinecone
    if (allVectorIds.length > 0) {
      try {
        await indexNs.deleteMany(allVectorIds);
      } catch (pineconeError) {
        return res.status(500).json({ success: false, message: 'Failed to delete vectors from Pinecone.' });
      }
    }

    // Delete file metadata from MongoDB
    try {
      await file.deleteOne();
    } catch (mongoError) {
      return res.status(500).json({ success: false, message: 'Failed to delete file metadata from MongoDB.' });
    }

    const projectDoc = await Project.findById(project)


    await Promise.all([
      User.findByIdAndUpdate(userId, { $inc: { 'usage.filesUploaded': -1 } }),
      Project.findByIdAndUpdate(project._id, { $inc: { totalFiles: -1 } }),
    ]);

   
    const files = await File.find({ userId });
    return res.status(200).json({
      success: true,
      message: 'File and its vectors deleted successfully.',
      data: files,
    });
  } catch (error) {
    console.error('❌ deleteFile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
