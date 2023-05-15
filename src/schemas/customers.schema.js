import joi from 'joi';

export const registerCustomerSchema = joi.object({
    name: joi.string().required().trim(),
    phone: joi.string().trim().min(10).max(11),
    cpf: joi.string().min(0).length(11).required(),
    birthday: joi.date().required()
})