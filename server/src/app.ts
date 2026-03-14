import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import projectRouter from "./modules/projects/project.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/api/project", projectRouter);

export default app;
