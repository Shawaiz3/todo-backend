import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { NextFunction } from "connect";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        token?: string | JwtPayload;
    }
}
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader != 'undefined') {
            const token = bearerHeader.split(' ')[1]; // To remove bearer from token

            const user = jwt.verify(token, process.env.JWT_SECRET!);
            req.token = user;
            next();

        } else {
            res.status(401).send("No token provided");
        }
    } catch (error) {
        res.status(403).send("Invalid or Expire Token");
    }
}
export default auth;