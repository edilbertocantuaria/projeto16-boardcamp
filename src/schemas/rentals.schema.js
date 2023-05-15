import joi from 'joi';

export const registerRentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
})