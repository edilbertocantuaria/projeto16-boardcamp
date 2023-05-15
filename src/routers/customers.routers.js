import { Router } from "express";

import { validateSchema } from "../middlewares/validateSchema.js"
import { registerCustomerSchema } from "../schemas/customers.schema.js";

import { findCustomers, findCustomerByID, registerCustomer, updatingCustomerByID } from "../controllers/customers.controllers.js";



const customersRouter = Router();

customersRouter.get("/customers", findCustomers);
customersRouter.get("/customers/:id", findCustomerByID);
customersRouter.post("/customers", validateSchema(registerCustomerSchema), registerCustomer);
customersRouter.put("/customers/:id", validateSchema(registerCustomerSchema), updatingCustomerByID);

export default customersRouter