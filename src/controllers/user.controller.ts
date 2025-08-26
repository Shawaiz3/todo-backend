import { Request, Response } from 'express'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import userModel from '../models/user.model'

dotenv.config();

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) {
        return res.status(409).json({ error: "Email already in use" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await userModel.create({
        name,
        email,
        password: hashed
    })
    return res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
        { userId: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '10m' }
    )
    return res.status(200).json({ token });
}

export const logout = async (req: Request, res: Response) => {
    return res.status(201).json({ message: "User logout successfully" });
}