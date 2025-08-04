import jwt from 'jsonwebtoken';
export default function verifyAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        // 🔒 No token — redirect to login
        return res.redirect('/auth/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        // 🔒 Invalid or expired token — also redirect to login
        return res.redirect('/auth/login');
    }
}
