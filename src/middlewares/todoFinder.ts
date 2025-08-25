import express from "express";
import todoModel from "../models/todo.model";

export async function findTodoById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const selectedUser = await todoModel.findById(id);
    if (selectedUser) {
        next();
    } else {
        res.status(404).json({ message: `No Data Found!` });
    }
}