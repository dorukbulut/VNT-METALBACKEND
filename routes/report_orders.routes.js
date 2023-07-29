import express from "express";
const router = express.Router();
import ReportOrdersService from "../controllers/report_orders.controller.js"

router.post("/customer-report", ReportOrdersService.customerReport)

export default router
