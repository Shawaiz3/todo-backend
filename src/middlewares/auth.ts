import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { NextFunction } from "connect";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from '../controllers/todo.controller'

declare module "express-serve-static-core" {
    interface Request {
        token?: string | JwtPayload;
    }
}
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader != 'undefined') {
            const token = bearerHeader.split(' ')[1]; // To remove bearer from token

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; name: string };
            req.token = decoded;
            req.user = decoded
            next();

        } else {
            res.status(401).json({ error: "No token provided" });
        }
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expire Token" });
    }
}
export default auth;