import { registerRentalsSchema } from "../schemas/rentals.schema.js";

export function registerRentalsValidationMiddleware(req, res, next) {
    const validation = registerRentalsSchema.validate(req.body);
    if (validation.error) {
        return res.send(error.message)
    }
    next();
}