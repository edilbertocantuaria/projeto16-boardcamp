import { Router } from "express";
import gameRouter from "./games.routers.js";
import customersRouter from "./customers.routers.js"

const router = Router();

router.use(gameRouter);
router.use(customersRouter);

export default router;