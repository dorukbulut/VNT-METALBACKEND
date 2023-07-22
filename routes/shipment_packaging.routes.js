import express from "express";
const router = express.Router();
import ShipmentPackagingController from "../controllers/shipment_packaging.controller.js"
//CRUD ROUTES
router.get("/get-page/:page", ShipmentPackagingController.getPage);
router.get("/filter", ShipmentPackagingController.getFiltered);
router.post("/search-workorder", ShipmentPackagingController.searchWorkOrder);
router.post("/create", ShipmentPackagingController.createPackage);
router.post("/delete", ShipmentPackagingController.deletePackage);
router.post("/update", ShipmentPackagingController.updatePackage);
router.post("/get", ShipmentPackagingController.getPackage);
export default router;
