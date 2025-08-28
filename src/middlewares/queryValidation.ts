import joi from 'joi'

export const querySchema = joi.object({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).default(5),
    task: joi.string().strict().optional()
});
