import express from "express";
const router = express.Router();
import customerRoutes from "./customer.routes.js";
import analyzeRoute from "./analyse.routes.js";
import quotationItemRoutes from "./quotationItems.routes.js";
import quotationFormRoutes from "./quotationForm.routes.js";
import saleConfirmationRoutes from "./saleConfirmation.routes.js";
import WorkOrders from "./workOrders.routes.js";
import ProductionProductRoutes from "./production_product.routes.js";
import ProductionAtelierRoutes from "./production_atelier.routes.js";
import QCProductionRoutes from "./qc_production.routes.js";
import QCAtelierRoutes from "./qc_atelier.routes.js";

//all routes.
// ORDER MODULE
router.use("/customer", customerRoutes);
router.use("/analyze", analyzeRoute);
router.use("/quotation-items", quotationItemRoutes);
router.use("/quotation-form", quotationFormRoutes);
router.use("/sale-confirmation", saleConfirmationRoutes);
router.use("/work-order", WorkOrders);
// PRODUCTION MODULE
router.use("/production-product", ProductionProductRoutes);
router.use("/production-atelier", ProductionAtelierRoutes);

// QC-MODULE
router.use("/qc-production", QCProductionRoutes);
router.use("/qc-atelier", QCAtelierRoutes);

// REPORT MODULE

// SHIPMENT

// ADMIN DASHBOARD


export default router;
