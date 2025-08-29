import { Request, Response } from "express";
import userModel from "../models/user.model";
import { AuthRequest } from '../controllers/todo.controller'
import todoModel from "../models/todo.model";
import { querySchema } from "../middlewares/queryValidation"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { error, value } = querySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { page, limit, search } = value; // now defaults are applied
        const jump = (page - 1) * limit;

        const filter: any = {};

        if (search && search.trim() !== "") {
            filter.name = { $regex: search, $options: "i" };
        }
        const totalUsers = await userModel.countDocuments(filter); // For total no of users
        const users = await userModel.find(filter, "name email").skip(jump).limit(limit); // only username + email
        if (users.length == 0) {
            res.status(200).json({ message: `No data found!` });
        }
        res.status(200).json({
            totalUsers,
            users
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};

export const listAllTodos = async (req: AuthRequest, res: Response) => {

    const { error, value } = querySchema.validate(req.query);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { page, limit, search, status, last24h } = value; // now defaults are applied
    const jump = (page - 1) * limit;

    const filter: any = {};
    if (status) {
        filter.status = String(status).toLowerCase(); // pending or completed
    }

    // last 24 hours filter
    if (last24h === "true") {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        filter.createdAt = { $gte: cutoff }; //$gte means “greater than or equal”.
    }

    if (search && search.trim() !== "") {
        filter.task = { $regex: search, $options: "i" };
    }
    const totalTodos = await todoModel.countDocuments(filter); // For total no of todos
    const data = await todoModel.find(filter).skip(jump).limit(limit);

    if (data.length == 0) {
        res.status(200).json({ message: `No data found!` });
    }
    res.status(200).json({
        totalTodos,
        data    
    });
}