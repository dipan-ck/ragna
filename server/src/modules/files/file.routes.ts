import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import * as fileController from "./file.controller.js";

const router = Router();

router.get("/project/:projectId", requireAuth, fileController.getProjectFiles);
router.get("/:fileId", requireAuth, fileController.getFile);
router.post("/:fileId/reembed", requireAuth, fileController.retriggerEmbedding);
router.post("/upload-url", requireAuth, fileController.getUploadUrl);

router.post("/confirm-upload", requireAuth, fileController.confirmUpload);

export default router;
