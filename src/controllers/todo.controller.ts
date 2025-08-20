import { Request, Response } from "express";
import todoModel from "../models/todo.model"; // adjust import

export const createTodos = async (req: Request, res: Response) => {
    const body = req.body?.task;
    await todoModel.create({
        task: body
    })
    res.status(201).send(`Sucessfully Added task: ${body}`);
};

export const listTodos = async (req: Request, res: Response) => {
    const data = await todoModel.find({});
    res.status(200).json({ data });
}

export const updateTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body?.task;
    await todoModel.findByIdAndUpdate(id, { task: body });
    res.status(200).send(`Updated record at id = ${id}`);
}

export const deleteTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(200).send(`Deleted record at id = ${id}`);
}