import { Request, Response } from "express";
import todoModel from "../models/todo.model";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;   
    name?: string;
    email?: string;
  };
}


export const createTodos = async (req: AuthRequest, res: Response) => {
    await todoModel.create({
        task: req.body.task,
        userId: req.user?.userId
    })
    res.status(201).json({ message: `Sucessfully Added task` });
};

export const listTodos = async (req: AuthRequest, res: Response) => {
    const status = req.query.status;
    const filter: any = { userId: req.user?.userId };
    if (status) {
        filter.status = String(status).toLowerCase(); // pending or completed
    }
    const data = await todoModel.find(filter);
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