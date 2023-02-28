import express from "express";
const router = express.Router();
import analyzeControllers from "../controllers/analyse.controller.js";

//CRUD ROUTES
router.post("/create", analyzeControllers.createAnalyse);
router.post("/get", analyzeControllers.getAnalyse);
router.get("/getAll", analyzeControllers.getAllAnalyze);
router.post("/update", analyzeControllers.updateAnalyze);

export default router;
