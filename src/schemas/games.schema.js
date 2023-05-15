import joi from 'joi';

export const registerGameSchema = joi.object({
    name: joi.string().required().trim(),
    image: joi.string().trim(),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
})