import { Request, Response } from "express";
import todoModel from "../models/todo.model";
import { querySchema } from "../middlewares/queryValidation"

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
        name?: string;
        email?: string;
    };
}


export const createTodos = async (req: AuthRequest, res: Response) => {
    const taskCreated = await todoModel.create({
        task: req.body.task,
        userId: req.user?.userId
    })
    res.status(201).json({ taskCreated });
};

export const listTodos = async (req: AuthRequest, res: Response) => {
    const status = req.query.status;
    const { error, value } = querySchema.validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { page, limit } = value; // now defaults are applied
    const jump = (page - 1) * limit;
    const filter: any = { userId: req.user?.userId };
    if (status) {
        filter.status = String(status).toLowerCase(); // pending or completed
    }
    const data = await todoModel.find(filter).skip(jump).limit(limit);
    if (data.length == 0) {
        res.status(200).json({ message: `No data found!` });
    }
    res.status(200).json({ data });
}

export const updateTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { task, status } = req.body;
    await todoModel.findByIdAndUpdate(id, { task, status });
    res.status(200).json({ message: `Updated record at id = ${id}` });
}

export const deleteTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(200).send({ message: `Deleted record at id = ${id}` });
}