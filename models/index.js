import TaxInfo from "./taxinfo.model.js";
import Customer from "./customer.model.js";
import CustomerAdress from "./customerAdress.model.js";
import Analyze from "./analyze.model.js";
import BracketBush from "./bracketBush.model.js";
import Certificate from "./certificates.model.js";
import DeliveryType from "./deliveryType.model.js";
import PlateStrip from "./plate_strip.model.js";
import QuotationForm from "./quotationForm.model.js";
import QuotationItem from "./quotationItems.model.js";
import SaleConfirmation from "./saleConfirmation.model.js";
import WorkOrder from "./workOrders.model.js";
import StraigthBush from "./strBush.model.js";
import DoubleBracketBush from "./DoubleBracketBush.js";
import MiddleBracketBush from "./MiddleBracketBush.js";
import ProductHeader from "./productheader.model.js";
import Products from "./product.model.js";
import Process from "./atelier.model.js";
import InventoryHeader from "./inventoryHeader.model.js";
import Shipments from "./shipment.model.js"
import Package from "./package.model.js";

//Customer-TaxInfo
Customer.hasOne(TaxInfo, {
  foreignKey: "Customer_ID",
});

//Customer-Adress
Customer.hasOne(CustomerAdress, {
  foreignKey: "Customer_ID",
});

//Customer-QuotationItem
Customer.hasMany(QuotationItem, {
  foreignKey: "Customer_ID",
});

//QuotationItem-Analyze
QuotationItem.Analyze = Analyze.hasMany(QuotationItem, {
  foreignKey: "Analyze_ID",
});

QuotationItem.belongsTo(Analyze, {
  foreignKey: "Analyze_ID",
});

//QuotationItem-plate
QuotationItem.PlateStrip = QuotationItem.hasOne(PlateStrip, {
  foreignKey: "Item_ID",
  onDelete: "CASCADE",
});
//QuotationItem-strBush
QuotationItem.StraigthBush = QuotationItem.hasOne(StraigthBush, {
  foreignKey: "Item_ID",
  onDelete: "CASCADE",
});

//QuotationItemBracketBush
QuotationItem.BracketBush = QuotationItem.hasOne(BracketBush, {
  foreignKey: "Item_ID",
  onDelete: "CASCADE",
});

//QuotationItemDoubleBracketBush
QuotationItem.DoubleBracketBush = QuotationItem.hasOne(DoubleBracketBush, {
  foreignKey: "Item_ID",
  onDelete: "CASCADE",
});

//QuotationItemMiddleBracketBush
QuotationItem.MiddleBracketBush = QuotationItem.hasOne(MiddleBracketBush, {
  foreignKey: "Item_ID",
  onDelete: "CASCADE",
});

//QuotationForm-QuotationItem
QuotationForm.hasMany(QuotationItem, {
  foreignKey: "Quotation_ID",
});

QuotationItem.belongsTo(QuotationForm, {
  foreignKey: "Quotation_ID",
});

//Customer-QuotationForm
Customer.hasMany(QuotationForm, {
  foreignKey: "Customer_ID",
});

QuotationForm.belongsTo(Customer, {
  foreignKey: "Customer_ID",
});

//Delivary-QuotationForm
DeliveryType.hasMany(QuotationForm, {
  foreignKey: "Delivery_ID",
});

QuotationForm.belongsTo(DeliveryType, {
  foreignKey: "Delivery_ID",
});

//SaleConfirmation-QuotationForm
QuotationForm.hasMany(SaleConfirmation, {
  foreignKey: "Quotation_ID",
});

SaleConfirmation.belongsTo(QuotationForm, {
  foreignKey: "Quotation_ID",
});

//SaleConfirmation-QuotationItem
QuotationItem.hasOne(SaleConfirmation, {
  foreignKey: "Item_ID",
});

SaleConfirmation.belongsTo(QuotationItem, {
  foreignKey: "Item_ID",
});

//SaleConfirmation-Certificates
SaleConfirmation.hasMany(Certificate, {
  foreignKey: "Sale_ID",
});

Certificate.belongsTo(SaleConfirmation, {
  foreignKey: "Sale_ID",
});

//Customer-SaleConfirmation
Customer.hasMany(SaleConfirmation, {
  foreignKey: "Customer_ID",
});

SaleConfirmation.belongsTo(Customer, {
  foreignKey: "Customer_ID",
});

//SaleConfirmation-WorkOrder
SaleConfirmation.hasOne(WorkOrder, {
  foreignKey: "Sale_ID",
});

WorkOrder.belongsTo(SaleConfirmation, {
  foreignKey: "Sale_ID",
});

//WorkOrder-Quotation Item
QuotationItem.hasOne(WorkOrder, {
  foreignKey: "Item_ID",
});

WorkOrder.belongsTo(QuotationItem, {
  foreignKey: "Item_ID",
});

//WorkOrder-Quotation Item
WorkOrder.hasOne(ProductHeader, {
  foreignKey: "WorkOrder_ID",
});

ProductHeader.belongsTo(WorkOrder, {
  foreignKey: "WorkOrder_ID",
});

//WorkOrder-Customer
Customer.hasMany(WorkOrder, {
  foreignKey: "Customer_ID",
});

WorkOrder.belongsTo(Customer, {
  foreignKey: "Customer_ID",
});

//ProductHeader-Products
ProductHeader.hasMany(Products, {
  foreignKey: "ProductHeader_ID",
});

Products.belongsTo(ProductHeader, {
  foreignKey: "ProductHeader_ID",
});

//ProductHeader-Atelier
ProductHeader.hasMany(Process, {
  foreignKey: "ProductHeader_ID",
});

Process.belongsTo(ProductHeader, {
  foreignKey: "ProductHeader_ID",
});

//Atelier-Products
Products.hasMany(Process, {
  foreignKey : "Product_ID",
});

Process.belongsTo(Products, {
  foreignKey : "Product_ID",
});

// test
//ProductHeader-Atelier
ProductHeader.hasMany(Shipments, {
  foreignKey: "ProductHeader_ID",
});

Shipments.belongsTo(ProductHeader, {
  foreignKey: "ProductHeader_ID",
});

//Shipments-Products
Products.hasMany(Shipments, {
  foreignKey : "Product_ID",
});

Shipments.belongsTo(Products, {
  foreignKey : "Product_ID",
});

Shipments.belongsTo(Package, {
  foreignKey : "Package_ID"
});

Package.hasMany(Shipments, {
  foreignKey : "Package_ID"
})


//WorkOrder-Quotation Item
WorkOrder.hasOne(Package, {
  foreignKey: "WorkOrder_ID",
});

Package.belongsTo(WorkOrder, {
  foreignKey: "WorkOrder_ID",
});



export default {
  TaxInfo,
  WorkOrder,
  DoubleBracketBush,
  MiddleBracketBush,
  StraigthBush,
  SaleConfirmation,
  QuotationItem,
  Customer,
  CustomerAdress,
  Analyze,
  BracketBush,
  Certificate,
  DeliveryType,
  PlateStrip,
  QuotationForm,
  ProductHeader,
  Products,
  InventoryHeader,
  Shipments,
  Process,
};
