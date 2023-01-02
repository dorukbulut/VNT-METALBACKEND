import express from 'express';
const router = express.Router();
import customerControllers from "../controllers/customer.controller.js";


//CRUD ROUTES
router.post("/create", customerControllers.createCustomer);
router.post("/update", customerControllers.updateCustomer);
router.post("/get", customerControllers.getCustomer);
router.get("/all", customerControllers.getAllCustomers);
router.delete("/delete",customerControllers.deleteCustomer);

router.get("/get-page/:page",customerControllers.getPage);
router.get("/filter",customerControllers.getFiltered);

export default router;