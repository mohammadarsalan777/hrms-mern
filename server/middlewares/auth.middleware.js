import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req?.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.employee = decoded._id
        next()


    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};