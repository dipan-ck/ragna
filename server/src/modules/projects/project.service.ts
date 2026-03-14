import { prisma } from "../../config/prisma.js";

type CreateProjectInput = {
    userId: string;
    name: string;
    instructions?: string;
};

export async function createProject(data: CreateProjectInput) {
    return prisma.project.create({
        data,
    });
}

export async function updateProjectTitle(projectId: string, name: string) {
    return prisma.project.update({
        where: { id: projectId },
        data: { name },
    });
}

export async function getAllProjects(userId: string) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function updateProjectInstructions(
    projectId: string,
    instructions: string,
) {
    return prisma.project.update({
        where: { id: projectId },
        data: { instructions },
    });
}

export async function findProject(projectId: string, userId: string) {
    return prisma.project.findFirst({
        where: { id: projectId, userId },
    });
}

export async function deleteProject(projectId: string) {
    return prisma.project.delete({
        where: { id: projectId },
    });
}
