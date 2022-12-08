import express from "express";
const router = express.Router();
import saleConfirmationController from "../controllers/saleConfirmation.controller.js";


router.post("/create", saleConfirmationController.createForm);
router.post("/update", saleConfirmationController.updateForm);
router.post("/get", saleConfirmationController.getForms);
router.post("/delete", saleConfirmationController.deleteForm);
router.get("/all", saleConfirmationController.getAll);
router.post("/generate", saleConfirmationController.generateForm);

export default router;