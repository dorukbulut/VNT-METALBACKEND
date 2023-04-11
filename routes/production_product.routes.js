import express from "express";
const router = express.Router();
import ProductControllers from "../controllers/production_product.controller.js";

//CRUD ROUTES
router.get("/get-page/:page", ProductControllers.getPage);
router.get("/filter", ProductControllers.getFiltered);
router.post("/get", ProductControllers.getProduct);

export default router;
