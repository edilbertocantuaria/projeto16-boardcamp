import { Router } from "express";

import { validateSchema } from "../middlewares/validateSchema.js"
import { registerGameSchema } from "../schemas/games.schema.js";

import { findGames, registerGame } from "../controllers/games.controllers.js";

//import {gameValidation} from "../middlewares/gamesValidationMiddleware.js";

const gameRouter = Router();

gameRouter.get("/games", findGames);
gameRouter.post("/games", validateSchema(registerGameSchema), registerGame);

export default gameRouter