// src/middleware/checkJWT.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { JwtPayload } from '../types/jwt';

const whiteList: (string | RegExp)[] = [
    '/login',
    '/products',
    '/register',
    /^\/products\/[^/]+$/
];

export const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const isWhiteList = whiteList.some(route =>
        route instanceof RegExp ? route.test(req.path) : route === req.path
    );

    if (isWhiteList) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        req.user = {
            id: decoded.id,
            username: decoded.username,
            avatar: decoded.avatar,
            name: decoded.name,
            role: decoded.role,
        };

        next();
    } catch (err: any) {
        return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
    }
};
