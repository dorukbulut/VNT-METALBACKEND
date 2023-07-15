import express from "express";
const router = express.Router();
import ShipmentPackagingController from "../controllers/shipment_packaging.controller.js"
//CRUD ROUTES
router.get("/get-page/:page", ShipmentPackagingController.getPage);
router.get("/filter", ShipmentPackagingController.getFiltered);
router.post("/search-workorder", ShipmentPackagingController.searchWorkOrder);
export default router;
