import { generateProjectApiKey } from "libs/generateProjectApiKey";
import Project from "models/Project";
import User from "models/User";
import Chat from "models/Chat";
import File from "models/File";
import { sendNotification } from "libs/sendNotification";
import { modelDeepSeekR1, modelGemini2_0flash, modelKimiK2Instruct } from "libs/modelInteraction";
import { pineconeIndex } from "config/PineconeClient";
export async function createProject(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const { name, model, AgentInstructions } = req.body;
        if (!name || !model || !AgentInstructions) {
            return res
                .status(400)
                .json({ success: false, message: "Name, model and Agent Instructions are Required are required" });
        }
        const apiKey = generateProjectApiKey();
        const namespace = generateProjectApiKey();
        const project = await Project.create({
            userId,
            name,
            model,
            AgentInstructions: AgentInstructions || "",
            apiKey,
            namespace,
        });
        user.usage.projectsCreated += 1;
        await user.save();
        await sendNotification(userId, "success", `Project "${name}" was created.`);
        return res
            .status(201)
            .json({ success: true, message: "Project Created", data: project });
    }
    catch (error) {
        console.error("Error creating project:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
export async function getAllProjects(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const projects = await Project.find({ userId });
        return res.status(200).json({ success: true, data: projects });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
export async function getProject(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const projectID = req.params.id;
        if (!projectID) {
            return res
                .status(400)
                .json({ success: false, message: "Project ID is required" });
        }
        const project = await Project.findOne({ _id: projectID, userId });
        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found" });
        }
        return res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        console.error("Error fetching project:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
export async function tooggleStatus(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const projectID = req.params.id;
        if (!projectID) {
            return res
                .status(400)
                .json({ success: false, message: "Project ID is required" });
        }
        const project = await Project.findById(projectID);
        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found" });
        }
        if (project.status == "active") {
            project.status = "inactive";
            await project.save();
        }
        else {
            project.status = "active";
            await project.save();
        }
        return res
            .status(200)
            .json({
            success: true,
            message: "Status Updated Successfully",
            data: project,
        });
    }
    catch (error) {
        console.error("Error in toggle status:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
export async function regenerateProjectKey(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const projectID = req.params.id;
        if (!projectID) {
            return res
                .status(400)
                .json({ success: false, message: "Project ID is required" });
        }
        const project = await Project.findById(projectID);
        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found" });
        }
        await project.save();
        return res
            .status(200)
            .json({
            success: true,
            message: "Api key Regenerated successfully",
            data: project,
        });
    }
    catch (error) {
        console.error("Error in Api key Generation:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
export async function chatWithModel(req, res) {
    try {
        const projectId = req.params.projectId;
        const { message } = req.body;
        if (!projectId) {
            return res.status(400).json({ success: false, message: 'Project ID is required' });
        }
        if (!message) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const userId = project.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        switch (project.model) {
            case 'gemini-2.0-flash':
                return await modelGemini2_0flash(message, res, project, user, projectId, userId);
            case "Kimi-K2-Instruct":
                return await modelKimiK2Instruct(message, res, project, user, projectId, userId);
            case "deepSeek-r1":
                return await modelDeepSeekR1(message, res, project, user, projectId, userId);
            default:
                return res.status(400).json({ success: false, message: `Unsupported model: ${project.model}` });
        }
    }
    catch (err) {
        console.error('chatWithModel error:', err);
        res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
        res.end();
    }
}
// export async function getAllChats(req: Request, res: Response){
//     try{
//         const userId = req.user?.id;
//         const {projectId} = req.body;
//         if(!userId || !projectId){
//             return res.status(400).json({success: false, message: 'Missing required fields.' });
//         }
//         const chats = await Chat.find({ projectId, userId});
//         return res.status(200).json({success: true, data: chats});
//     }catch(error){
//         console.error('Get all chats error:', error);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }
export async function getAllChats(req, res) {
    try {
        const userId = req.user?.id;
        const { projectId, limit = 20, before } = req.body;
        if (!userId || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields.',
            });
        }
        const query = { projectId, userId };
        if (before) {
            query.createdAt = { $lt: new Date(before) }; // fetch older than this
        }
        const chats = await Chat.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        return res.status(200).json({
            success: true,
            data: chats.reverse(), // send oldest-to-newest for UI
        });
    }
    catch (error) {
        console.error('Get all chats error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
export async function deleteProject(req, res) {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        if (!userId || !projectId) {
            return res.status(400).json({ success: false, message: 'Missing userId or projectId.' });
        }
        const project = await Project.findById(projectId);
        if (!project || project.userId.toString() !== userId) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized.' });
        }
        const namespace = project.namespace;
        const indexNs = pineconeIndex.namespace(namespace);
        try {
            const result = await indexNs.query({
                topK: 1000,
                vector: new Array(384).fill(0),
                includeMetadata: true,
            });
            const allVectorIds = result.matches.map(match => match.id);
            if (allVectorIds.length > 0) {
                await indexNs.deleteMany(allVectorIds);
            }
        }
        catch (pineconeError) {
            console.error('❌ Pinecone error:', pineconeError);
            return res.status(500).json({ success: false, message: 'Failed to delete vectors from Pinecone.' });
        }
        try {
            const files = await File.find({ projectId });
            if (files.length > 0) {
                await File.deleteMany({ projectId });
            }
        }
        catch (mongoError) {
            console.error('❌ MongoDB file deletion error:', mongoError);
            return res.status(500).json({ success: false, message: 'Failed to delete file metadata from MongoDB.' });
        }
        try {
            await project.deleteOne();
        }
        catch (mongoError) {
            console.error('❌ MongoDB project deletion error:', mongoError);
            return res.status(500).json({ success: false, message: 'Failed to delete project from MongoDB.' });
        }
        const user = await User.findById(userId);
        user.usage.projectsCreated -= 1;
        user.usage.filesUploaded -= project.totalFiles;
        user.usage.tokensUsed -= project.tokensUsed;
        await user.save();
        await sendNotification(userId, "warning", `Project "${project.name}" was deleted.`);
        return res.status(200).json({
            success: true,
            message: 'Project, its files, and vectors deleted successfully.',
        });
    }
    catch (error) {
        console.error('❌ deleteProject error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
export async function updateProject(req, res) {
    try {
        const projectId = req.params.projectId;
        const { name, model, AgentInstructions } = req.body;
        // Validate inputs
        if (!name && !model && !AgentInstructions) {
            return res.status(400).json({ success: false, message: 'No valid fields to update.' });
        }
        const updateFields = {};
        if (name)
            updateFields.name = name;
        if (model)
            updateFields.model = model;
        if (AgentInstructions)
            updateFields.AgentInstructions = AgentInstructions;
        const updatedProject = await Project.findByIdAndUpdate(projectId, { $set: updateFields }, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }
        return res.status(200).json({
            success: true,
            message: 'Project updated successfully.',
            project: updatedProject,
        });
    }
    catch (error) {
        console.error('❌ updateProject error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}
