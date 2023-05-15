import { registerCustomerSchema } from "../schemas/customers.schema.js";

export function registerCustomerValidationMiddleware(req, res, next) {
    const validation = registerCustomerSchema.validate(req.body);
    if (validation.error) {
        return res.send(error.message)
    }
    next();
}