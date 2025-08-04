import { chatWithModel, createProject, deleteProject, getAllChats, getAllProjects, getProject, regenerateProjectKey, tooggleStatus, updateProject } from 'controllers/ProjectController';
import express, { Router } from 'express';
import checkProjectLimit from 'middlewares/checkProjectLimit';
import verifyAuth from 'middlewares/verifyAuth';



const router: Router = express.Router();

// router.post("/create",verifyAuth, checkProjectLimit, createProject);
router.post("/create",verifyAuth, createProject);
router.get("/get", verifyAuth, getAllProjects);
router.get("/get/:id", verifyAuth, getProject);
router.get("/toggle-status/:id", verifyAuth, tooggleStatus)
router.get("/regenerate-key/:id", verifyAuth, regenerateProjectKey)
router.post("/:projectId/chat", chatWithModel);
router.post("/get-chats", verifyAuth, getAllChats);
router.delete("/delete/:projectId", verifyAuth, deleteProject)
router.patch("/update/:projectId", verifyAuth, updateProject)

export default router;