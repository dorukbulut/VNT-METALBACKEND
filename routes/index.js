import express from  "express";
const router = express.Router();
import customerRoutes from "./customer.routes.js";
import analyzeRoute from "./analyse.routes.js";
import quotationItemRoutes from "./quotationItems.routes.js"
import quotationFormRoutes from "./quotationForm.routes.js";

//all routes.
router.use("/customer", customerRoutes);
router.use("/analyze", analyzeRoute);
router.use("/quotation-items", quotationItemRoutes);
router.use("/quotation-form", quotationFormRoutes);

export default router;