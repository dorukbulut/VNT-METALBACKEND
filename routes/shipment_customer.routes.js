import express from "express";
const router = express.Router();
import ShipmentCustomerController from "../controllers/shipment_customer.controller.js"

//CRUD ROUTES

router.get("/get-page/:page", ShipmentCustomerController.getPage);
router.get("/filter", ShipmentCustomerController.getFiltered);
router.post("/get-all", ShipmentCustomerController.getAllItems);

export default router;
