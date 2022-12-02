import TaxInfo from "./taxinfo.model.js";
import Customer from "./customer.model.js";
import CustomerAdress from "./customerAdress.model.js";
import Analyze from "./analyze.model.js"

//TODO DB REALATIONS

//Customer-TaxInfo
Customer.hasOne(TaxInfo, {
    foreignKey : "Customer_ID"
});

//Customer-Adress
Customer.hasOne(CustomerAdress, {
    foreignKey : "Customer_ID"
});





export default {TaxInfo, Customer, CustomerAdress, Analyze}