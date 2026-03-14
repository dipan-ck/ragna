import { z } from "zod";
import { Request, Response } from "express";
import * as projectService from "./project.service.js";
import * as fileService from "../files/file.service.js";
import {
    createProjectSchema,
    updateTitleSchema,
    updateInstructionsSchema,
} from "./project.schema.js";

type ProjectParams = {
    id: string;
};

export async function getAllProjects(req: Request, res: Response) {
    const projects = await projectService.getAllProjects(req.user!.id);
    res.json(projects);
}

export async function getProject(req: Request<ProjectParams>, res: Response) {
    const project = await projectService.findProject(
        req.params.id,
        req.user!.id,
    );
    if (!project)
        return void res.status(404).json({ error: "Project not found" });
    res.json(project);
}

export async function createProject(req: Request, res: Response) {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success)
        return void res.status(400).json(z.treeifyError(parsed.error));

    const project = await projectService.createProject({
        userId: req.user!.id,
        ...parsed.data,
    });
    res.status(201).json(project);
}

export async function updateProjectTitle(
    req: Request<ProjectParams>,
    res: Response,
) {
    const parsed = updateTitleSchema.safeParse(req.body);
    if (!parsed.success)
        return void res.status(400).json(z.treeifyError(parsed.error));

    const exists = await projectService.findProject(
        req.params.id,
        req.user!.id,
    );
    if (!exists)
        return void res.status(404).json({ error: "Project not found" });

    const project = await projectService.updateProjectTitle(
        req.params.id,
        parsed.data.name,
    );
    res.json(project);
}

export async function updateProjectInstructions(
    req: Request<ProjectParams>,
    res: Response,
) {
    const parsed = updateInstructionsSchema.safeParse(req.body);
    if (!parsed.success)
        return void res.status(400).json(z.treeifyError(parsed.error));

    const exists = await projectService.findProject(
        req.params.id,
        req.user!.id,
    );
    if (!exists)
        return void res.status(404).json({ error: "Project not found" });

    const project = await projectService.updateProjectInstructions(
        req.params.id,
        parsed.data.instructions,
    );
    res.json(project);
}

export async function deleteProject(
    req: Request<ProjectParams>,
    res: Response,
) {
    const exists = await projectService.findProject(
        req.params.id,
        req.user!.id,
    );
    if (!exists)
        return void res.status(404).json({ error: "Project not found" });

    await fileService.deleteProjectFiles(req.params.id);
    await projectService.deleteProject(req.params.id);

    res.json({ message: "Project deleted" });
}
