import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface auth extends Request {
    user?: {
        username: string;
        role: string;
        email: string;
    };
}

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export const authMiddleware = async (req: auth, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is not available for this request!"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { username: string, role: string, email: string };

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};


export const checkRole = (allowedRoles: string[]) => {
    return (req: auth, res: Response, next: NextFunction): any => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. No role found."
            });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this route."
            });
        }

        next();
    };
};

