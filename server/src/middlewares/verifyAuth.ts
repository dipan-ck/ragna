import { logOutUser } from 'controllers/authController';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function verifyAuth(req: Request, res: Response, next: NextFunction) {
  let token = req.cookies.token;

    const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  console.log(token);
  

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = { id: (decoded as any).id };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    // 🔒 Invalid or expired token — also redirect to login
    return res.redirect('/auth/login');
  }
}
