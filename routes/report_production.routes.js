import express from "express";
import ReportProductionController from "../controllers/report_production.controller.js";
const router = express.Router();

router.get("/get-page/:page", ReportProductionController.getPage);
router.get("/filter", ReportProductionController.getFiltered);
export  default router
