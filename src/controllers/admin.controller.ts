import { Request, Response } from "express";
import userModel from "../models/user.model";
import { AuthRequest } from '../controllers/todo.controller'
import todoModel from "../models/todo.model";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find({}, "name email"); // only username + email

        res.status(200).json({
            totalUsers: users.length,
            users
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};

export const listAllTodos = async (req: AuthRequest, res: Response) => {
    const status = req.query.status;
    const last24h = req.query.last24h;
    const filter: any = {};
    if (status) {
        filter.status = String(status).toLowerCase(); // pending or completed
    }
    // last 24 hours filter
    if (last24h === "true") {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        filter.createdAt = { $gte: cutoff }; //$gte means “greater than or equal”.
    }
    const data = await todoModel.find(filter);
    if (data.length == 0) {
        res.status(200).json({ message: `No data found!` });
    }
    res.status(200).json({ data });
}