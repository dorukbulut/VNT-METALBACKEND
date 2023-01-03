import express from "express";
const router = express.Router();
import saleConfirmationController from "../controllers/saleConfirmation.controller.js";


router.post("/create", saleConfirmationController.createForm);
router.post("/update", saleConfirmationController.updateForm);
router.post("/get", saleConfirmationController.getForms);
router.delete("/delete", saleConfirmationController.deleteForm);
router.get("/all", saleConfirmationController.getAll);
router.post("/generate", saleConfirmationController.generateForm);

router.get("/get-page/:page",saleConfirmationController.getPage);
router.get("/filter",saleConfirmationController.getFiltered);

export default router;