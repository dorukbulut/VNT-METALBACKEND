import TaxInfo from "./taxinfo.model.js";
import Customer from "./customer.model.js";
import CustomerAdress from "./customerAdress.model.js";
import Analyze from "./analyze.model.js"
import strBush from "./strBush.model.js";

//Customer-TaxInfo
Customer.hasOne(TaxInfo, {
    foreignKey : "Customer_ID"
});

//Customer-Adress
Customer.hasOne(CustomerAdress, {
    foreignKey : "Customer_ID"
});

//Quotation : Customer-strBush
Customer.hasMany(strBush, {
    foreignKey : "Customer_ID"
});



export default {TaxInfo, Customer, strBush,CustomerAdress, Analyze}