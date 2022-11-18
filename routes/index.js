import express from  "express";
const router = express.Router();
import customerRoutes from "./customer.routes.js";


//all routes.
router.use("/customer", customerRoutes);

export default router;