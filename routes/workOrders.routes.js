import express from "express";
const router = express.Router();
import workOrdersController from "../controllers/workOrders.controller.js";

//ALL CRUD ROUTES.
router.post("/create", workOrdersController.createWorkOrder);
router.post("/update", workOrdersController.updateWorkOrder);
router.post("/get", workOrdersController.getWorkOrder);
router.get("/all", workOrdersController.getAllWorkOrder);
router.post("/generate", workOrdersController.generateWorkOrder);
router.delete("/delete", workOrdersController.deleteWorkOrder);
router.post("/get-work", workOrdersController.getByWorkOrder);
router.get("/get-page/:page", workOrdersController.getPage);
router.get("/filter", workOrdersController.getFiltered);
router.post("/set-true", workOrdersController.setTrue);

export default router;
