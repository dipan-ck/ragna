import { deleteFile, getAllFiles, uploadFileBlock, uploadTextBlock } from 'controllers/fileController';
import express from 'express';
import {upload} from 'libs/fileMulter';

import verifyAuth from 'middlewares/verifyAuth';


const router = express.Router();


router.post("/get", verifyAuth, getAllFiles);
router.delete("/delete", verifyAuth, deleteFile)
router.post('/upload/text', verifyAuth, uploadTextBlock); 
router.post('/upload/file', verifyAuth, upload.single("file"), uploadFileBlock);

export default router;
