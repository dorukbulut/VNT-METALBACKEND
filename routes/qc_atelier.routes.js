import express from "express";
const router = express.Router();
import QCAtelierController from "../controllers/qc_atelier.controller.js"

router.get("/get-page/:page", QCAtelierController.getPage);
router.get("/filter", QCAtelierController.getFiltered);
router.post("/set-qc", QCAtelierController.setQC);
export default router;
