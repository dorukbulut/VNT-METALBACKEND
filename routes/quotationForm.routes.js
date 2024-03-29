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
router.post("/get-quo", quotationFormController.getByQuotation);
router.get("/get-page/:page",quotationFormController.getPage);
router.get("/filter",quotationFormController.getFiltered);

export default router;
