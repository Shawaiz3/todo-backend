import { Request, Response } from "express";
import todoModel from "../models/todo.model";

export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const createTodos = async (req: AuthRequest, res: Response) => {
    await todoModel.create({
        task: req.body.task,
        userId: req.user?.userId
    })
    res.status(201).json({ message: `Sucessfully Added task` });
};

export const listTodos = async (req: AuthRequest, res: Response) => {
    const data = await todoModel.find({ userId: req.user?.userId });
    res.status(200).json({ data });
}

export const updateTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body?.task;
    await todoModel.findByIdAndUpdate(id, { task: body });
    res.status(200).json({ message: `Updated record at id = ${id}` });
}

export const deleteTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(200).send({ message: `Deleted record at id = ${id}` });
}