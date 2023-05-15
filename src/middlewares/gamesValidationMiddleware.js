import { registerGameSchema } from "../schemas/games.schema.js";

export function registerGameValidationMiddleware(req, res, next) {
    const validation = registerGameSchema.validate(req.body);
    if (validation.error) {
        return res.send(error.message)
    }
    next();
}