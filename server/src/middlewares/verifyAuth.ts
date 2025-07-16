import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}