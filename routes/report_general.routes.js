import express from "express";
const router = express.Router();
import ReportGeneralController from "../controllers/report_general.controller.js";

router.get("/get-report", ReportGeneralController.generalReport)
export default router;
