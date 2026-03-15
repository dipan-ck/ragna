import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import projectRouter from "./modules/projects/project.routes.js";
import fileRouter from "./modules/files/file.routes.js";
import conversationRouter from "./modules/conversation/conversation.routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || env.TRUSTED_ORIGINS?.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get("/ping", (req, res) => res.json({ ok: true }));
app.use("/api/project", projectRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/file", fileRouter);

export default app;
