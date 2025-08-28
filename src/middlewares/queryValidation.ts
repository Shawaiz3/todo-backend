import joi from 'joi'

export const querySchema = joi.object({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).default(5),
    search: joi.string().strict().optional(),
    status: joi.string().valid('pending', 'completed').optional()
});
