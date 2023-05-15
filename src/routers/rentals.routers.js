import { Router } from "express";

import { validateSchema } from "../middlewares/validateSchema.js"
import { registerRentalsSchema } from "../schemas/rentals.schema.js";
import { findRentals, registerRental, updatingRentalByID, deleteRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", findRentals);
rentalsRouter.post("/rentals", validateSchema(registerRentalsSchema), registerRental);
rentalsRouter.put("/rentals/:id/return", updatingRentalByID);
rentalsRouter.delete("/rentals/:id", deleteRental);


export default rentalsRouter