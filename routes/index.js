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
import ProductionInventoryRoutes from "./production_inventory.routes.js";
import ShipmentCustomerRoutes from "./shipment_customer.routes.js"
import ShipmentPackagingRoutes from "./shipment_packaging.routes.js"
import ReportOrdersRoutes from "./report_orders.routes.js";
import ReportProductionRoutes from "./report_production.routes.js";
import ReportGeneralRoutes from "./report_general.routes.js";

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

router.use("/production-inventory", ProductionInventoryRoutes);

// QC-MODULE
router.use("/qc-production", QCProductionRoutes);
router.use("/qc-atelier", QCAtelierRoutes);

// REPORT MODULE
router.use("/report-order", ReportOrdersRoutes)
router.use("/report-production", ReportProductionRoutes)
router.use("/report-general", ReportGeneralRoutes)
// SHIPMENT
router.use("/shipment-customer", ShipmentCustomerRoutes)
router.use("/shipment-packaging", ShipmentPackagingRoutes)

// ADMIN DASHBOARD


export default router;
