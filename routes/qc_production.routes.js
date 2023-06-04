import express from "express";
const router = express.Router();
import QCProductionController from "../controllers/qc_production.controller.js"

router.get("/get-page/:page", QCProductionController.getPage);
router.get("/filter", QCProductionController.getFiltered);
router.post("/set-qc", QCProductionController.setQC);
export default router;
