import { deleteFile, getAllFiles, uploadFileBlock, uploadTextBlock } from 'controllers/fileController.js';
import express from 'express';
import {upload} from 'libs/fileMulter.js';
import verifyAuth from 'middlewares/verifyAuth.js';


const router = express.Router();


router.post("/get", verifyAuth, getAllFiles);
router.delete("/delete", verifyAuth, deleteFile)
router.post('/upload/text', verifyAuth, uploadTextBlock); 
router.post('/upload/file', verifyAuth, upload.single("file"), uploadFileBlock);

export default router;
