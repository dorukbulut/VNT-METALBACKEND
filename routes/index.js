import express from  "express";
const router = express.Router();
import customerRoutes from "./customer.routes.js";
import analyzeRoute from "./analyse.routes.js";
import strBush from "./strBush.routes.js";

//all routes.
router.use("/customer", customerRoutes);
router.use("/analyze", analyzeRoute);
router.use("/strBush", strBush);

export default router;