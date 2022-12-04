import express from 'express';
const router = express.Router();
import quotationItemsController from '../controllers/quotationItems.controller.js';

//CRUD routes
router.post("/create", quotationItemsController.createItem);
router.post("/get", quotationItemsController.getItems);
router.get("/all", quotationItemsController.getAll);
router.post("/update", quotationItemsController.updateItem);
router.delete("/delete", quotationItemsController.deleteItem);


export default router;