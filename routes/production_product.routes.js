import express from "express";
const router = express.Router();
import ProductControllers from "../controllers/production_product.controller.js";

//CRUD ROUTES
router.get("/get-page/:page", ProductControllers.getPage);
router.get("/filter", ProductControllers.getFiltered);
router.post("/get/:page", ProductControllers.getProduct);
router.post("/create", ProductControllers.createProduct);
router.post("/update", ProductControllers.updateProduct);
router.post("/delete", ProductControllers.deleteProduct);
router.post("/finish", ProductControllers.finishProduct);
router.post("/getid", ProductControllers.getProductByid);
export default router;
