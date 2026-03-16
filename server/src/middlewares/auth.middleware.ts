import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { env } from "../config/env.js";

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (env.DEV_USER_ID) {
        req.user = { id: env.DEV_USER_ID };
        return next();
    }

    const session = await auth.api.getSession({
        headers: new Headers(req.headers as Record<string, string>),
    });

    if (!session) {
        res.status(401).json({ error: "unauthorized" });
        return;
    }

    req.user = { id: session.user.id };
    next();
};
