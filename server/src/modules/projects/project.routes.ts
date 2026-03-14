import { Router } from "express";
import * as projectController from "./project.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();
// router
router.get("/:id", requireAuth, projectController.getProject);
router.get("/get-all", requireAuth, projectController.getAllProjects);

router.post("/create", requireAuth, projectController.createProject);

router.patch("/:id/title", requireAuth, projectController.updateProjectTitle);

router.patch(
    "/:id/instructions",
    requireAuth,
    projectController.updateProjectInstructions,
);

router.delete("/:id", requireAuth, projectController.deleteProject);

export default router;
