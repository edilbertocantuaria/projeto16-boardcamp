import { Router } from "express";
import gameRouter from "./games.routers.js";

const router = Router();

router.use(gameRouter);

export default router;