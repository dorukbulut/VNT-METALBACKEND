import express from "express";
const router = express.Router();
import quotationItemsController from "../controllers/quotationItems.controller.js";

//CRUD routes
router.post("/create", quotationItemsController.createItem);
router.post("/get", quotationItemsController.getItems);
router.post("/get-quo", quotationItemsController.getByQuotation);
router.post("/get-id", quotationItemsController.getByItemID);
router.post("/getitems", quotationItemsController.getByQuotAndID);
router.get("/all", quotationItemsController.getAll);
router.post("/update", quotationItemsController.updateItem);
router.post("/set-quotation", quotationItemsController.setQuotation);
router.get("/get-page/:page", quotationItemsController.getPage);
router.get("/filter", quotationItemsController.getFiltered);

export default router;
