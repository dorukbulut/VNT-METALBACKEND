import express from "express";
const router = express.Router();
import AtelierControllers from "../controllers/production_atelier.controller.js";

//CRUD ROUTES
router.get("/get-page/:page", AtelierControllers.getPage);
router.get("/filter", AtelierControllers.getFiltered);

export default router;
