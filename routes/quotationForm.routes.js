import express from "express";
const router = express.Router();
import quotationFormController from "../controllers/quotationForm.controller.js";

//CRUD Routes.
router.post("/create", quotationFormController.createForm);
router.post("/get", quotationFormController.getForms);
router.get("/all", quotationFormController.getAllForms);
router.post("/update", quotationFormController.updateForms);
router.delete("/delete", quotationFormController.deleteForms);
router.post("/generate", quotationFormController.generateExport);

export default router;
