import express from 'express'
import joi from "joi";

const TodobodySchema = joi.object({
    task: joi.string().strict().required()
});
const UserbodySchema = joi.object({
    name: joi.string().strict(),
    email: joi.string().email().strict().required(),
    password: joi.string().min(6).required()
});
export function validateTodoBody(req: express.Request, res: express.Response, next: express.NextFunction) {
    TodobodySchema.validateAsync(req.body)
        .then(() => next())
        .catch((err) => {
            const message = err instanceof Error ? err.message : String(err);
            res.status(400).json({ message: `Invalid body: ${message}` });
        });
}
export function validateUserBody(req: express.Request, res: express.Response, next: express.NextFunction) {
    UserbodySchema.validateAsync(req.body)
        .then(() => next())
        .catch((err) => {
            const message = err instanceof Error ? err.message : String(err);
            res.status(400).json({ message: `Invalid body: ${message}` });
        });
}