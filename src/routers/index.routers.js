import { Router } from "express";
import gameRouter from "./games.routers.js";
import customersRouter from "./customers.routers.js"
import rentalsRouter from "../routers/rentals.routers.js"

const router = Router();

router.use(gameRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;