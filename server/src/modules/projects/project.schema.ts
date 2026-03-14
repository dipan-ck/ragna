import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1),
    instructions: z.string().optional(),
});

export const updateTitleSchema = z.object({
    name: z.string().min(1),
});

export const updateInstructionsSchema = z.object({
    instructions: z.string().min(1),
});
