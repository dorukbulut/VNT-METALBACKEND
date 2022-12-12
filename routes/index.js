import express from  "express";
const router = express.Router();
import customerRoutes from "./customer.routes.js";
import analyzeRoute from "./analyse.routes.js";
import quotationItemRoutes from "./quotationItems.routes.js"
import quotationFormRoutes from "./quotationForm.routes.js";
import saleConfirmationRoutes from "./saleConfirmation.routes.js";
import WorkOrders from "./workOrders.routes.js";

//all routes.
router.use("/customer", customerRoutes);
router.use("/analyze", analyzeRoute);
router.use("/quotation-items", quotationItemRoutes);
router.use("/quotation-form", quotationFormRoutes);
router.use("/sale-confirmation", saleConfirmationRoutes);
router.use("/work-order", WorkOrders)
export default router;