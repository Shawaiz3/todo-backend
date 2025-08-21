import express, { NextFunction } from 'express'
import mongoose from "mongoose";

// To check if ID is valid
export function validateId(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    next();
}