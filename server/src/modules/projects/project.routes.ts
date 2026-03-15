import { Router } from "express";
import * as projectController from "./project.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();
// router
router.get("/", requireAuth, projectController.getAllProjects);
router.get("/:id", requireAuth, projectController.getProject);
router.post("/create", requireAuth, projectController.createProject);

router.patch("/:id/title", requireAuth, projectController.updateProjectTitle);

router.patch(
    "/:id/instructions",
    requireAuth,
    projectController.updateProjectInstructions,
);

router.delete("/:id", requireAuth, projectController.deleteProject);

export default router;
