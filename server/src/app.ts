import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));

export default app;
