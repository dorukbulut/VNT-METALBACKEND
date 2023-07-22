import express from "express";
const router = express.Router();
import ShipmentCustomerController from "../controllers/shipment_customer.controller.js"

//CRUD ROUTES

router.get("/get-page/:page", ShipmentCustomerController.getPage);
router.get("/filter", ShipmentCustomerController.getFiltered);
router.post("/get-all", ShipmentCustomerController.getAllItems);
router.post("/get-shipments", ShipmentCustomerController.getShipments);
router.post("/search-package", ShipmentCustomerController.searchPackage);
router.post("/create", ShipmentCustomerController.createShipment);
router.post("/delete", ShipmentCustomerController.deleteShipment);
router.post("/finish", ShipmentCustomerController.finishShipment);

export default router;
