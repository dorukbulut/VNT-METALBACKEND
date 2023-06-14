import express from "express";
const router = express.Router();
import InventoryControllers from "../controllers/production_inventory.controller.js";


//CRUD ROUTES

router.post("/create", InventoryControllers.setInventory);
router.get("/get-page/:page", InventoryControllers.getPage);
router.get("/filter", InventoryControllers.getFiltered);
export default router;
