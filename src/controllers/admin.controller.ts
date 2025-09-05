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
        const { page, limit, search, sort } = value; // now defaults are applied
        const jump = (page - 1) * limit;

        const filter: any = {};

        if (search && search.trim() !== "") {
            filter.name = { $regex: search, $options: "i" };
        }
        const sortOrder = sort === "oldest" ? 1 : -1;     // Default sorting = latest first
        const totalUsers = await userModel.countDocuments(filter); // For total no of users
        const users = await userModel.find(filter, "name email").skip(jump).limit(limit).sort({ createdAt: sortOrder }); // only username + email
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
    const { page, limit, search, status, last24h, sort } = value; // now defaults are applied
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
    const sortOrder = sort === "oldest" ? 1 : -1;     // Default sorting = latest first
    const totalTodos = await todoModel.countDocuments(filter); // For total no of todos
    const data = await todoModel.find(filter).skip(jump).limit(limit).sort({ createdAt: sortOrder });

    if (data.length == 0) {
        res.status(200).json({ message: `No data found!` });
    }
    res.status(200).json({
        totalTodos,
        data
    });
}

export const getTodosPerUser = async (req: Request, res: Response) => {
    try {
        const result = await todoModel.aggregate([
            { $group: { _id: "$userId", totalTodos: { $sum: 1 } } },
            {
                $lookup: {
                    from: "users",               // collection name in MongoDB (plural, lowercase!)
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $project: { _id: 0, userName: "$user.name", userEmail: "$user.email", totalTodos: 1 } }
        ]);

        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ message: "Aggregation failed", error: err });
    }
};

export const averageTodosByUsers = async (req: Request, res: Response) => {
    try {
        const result = await todoModel.aggregate([
            { $group: { _id: "$userId", total: { $sum: 1 } } },
            { $group: { _id: null, avgTodos: { $avg: "$total" } } },
            { $project: { _id: 0, avgTodos: 1 } } // remove _id

        ]);

        res.json(result[0] || { avgTodos: 0 });
    } catch (err) {
        res.status(500).json({ message: "Aggregation failed", error: err });
    }
}
export const dailyCompletedTaskCount = async (req: Request, res: Response) => {
    try {
        const stats = await todoModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
                    total: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        if (stats.length == 0) {
            res.status(200).json({ message: `No data found!` });
        }
        res.json({ success: true, data: stats });
    } catch (err) {
        console.error("Aggregation error:", err);
        res.status(500).json({ success: false, message: "Aggregation error" });
    }
}