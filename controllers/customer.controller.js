import Customer from "../models/customer.model.js";
import TaxInfo from "../models/taxinfo.model.js";
import CustomerAdress from "../models/customerAdress.model.js";
import Models from "../models/index.js";
import {Op} from "sequelize";
import db from "../config/database.js";
export const createCustomer = async (req, res) => {
  
  try {
    const result = await db.transaction(async (t) => {
    const newCustomer = { ...req.body };
    const ncus = await Customer.create(newCustomer.customer, {transaction : t});
    const newTax = await TaxInfo.create({
      ...newCustomer.taxinfo,
      Customer_ID: newCustomer.customer.account_id,
    }, {transaction : t});
    const newAdd = await CustomerAdress.create({
      ...newCustomer.adressinfo,
      Customer_ID: newCustomer.customer.account_id,
    },{transaction : t});

    return 0
    })

    res.status(200).json({ message: "Customer created." });
    
  } catch (err) {
    res.status(500).json({ message: "An error occured." });
  }
};

//Done
export const updateCustomer = async (req, res) => {
  const customer = { ...req.body };
  try {
    const result = await db.transaction(async (t) => {
      if (Customer.findOne({ where: { account_id: customer.account_id } }, {transaction : t})) {
        let retval = await Customer.update(customer.customer, {
          where: { account_id: customer.account_id },
        },{transaction : t});
        retval = await TaxInfo.update(customer.taxinfo, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
        retval = await CustomerAdress.update(customer.adressinfo, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
  
        //others
  
        retval = await Models.QuotationItem.update({
          Customer_ID : customer.customer.account_id
        }, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
  
        retval = await Models.QuotationForm.update({
          Customer_ID : customer.customer.account_id
        }, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
        
        retval = await Models.SaleConfirmation.update({
          Customer_ID : customer.customer.account_id
        }, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
  
        retval = await Models.WorkOrder.update({
          Customer_ID : customer.customer.account_id
        }, {
          where: { Customer_ID: customer.account_id },
        },{transaction : t});
  
        
  
  
        res.status(200).json({ message: "Customer updated" });
      } else {
        res.status(401).json({ message: "Cannot find customer" });
      }
    })
    
  } catch (err) {
    res.status(500).json({ message: "An error occurred." });
  }
};

//Done
export const getCustomer = async (req, res) => {
  const q = { ...req.body };

  try {
    const customer = await Customer.findAll({
      where: {
        account_id: q.account_id,
      },
      include: [TaxInfo, CustomerAdress],
    });

    if (customer.length !== 0) {
      res.status(200).json({ customer });
    } else {
      res.status(401).json({ message: "Cannot find any user" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
  }
};

//Done
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [TaxInfo, CustomerAdress],
    });
    if (customers !== 0) {
      res.status(200).json({ customers });
    } else {
      res.status(401).json({ message: "No Customer found in database" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
  }
};

// Done
export const deleteCustomer = async (req, res) => {
  const cus = { ...req.body };
  try {
    const result = await db.transaction(async (t) => {
      const row = await Customer.findOne({
        where: { account_id: cus.account_id },
      }, {transaction : t});
      if (row) {
  
          let retval = await TaxInfo.destroy({
              where: {
                Customer_ID: cus.account_id,
              },
      
              force: true,
            }, {transaction : t});
            retval = await CustomerAdress.destroy({
              where: {
                Customer_ID: cus.account_id,
              },
      
              force: true,
            }, {transaction : t});
         retval = await Customer.destroy({
          where: {
            account_id: cus.account_id,
          },
  
          force: true,
        }, {transaction : t});
  
        
  
        
        
        res.status(200).json({ message: "Customer Deleted." });
      } else {
        res.status(401).json({ message: "Cannot find customer !" });
      }
    })
    
  } catch (err) {
    console.log(err);
    res.send(500).json({ message: "An error ocurred" });
  }
};

export const getPage = async (req, res) => {
  const pageNumber = req.params.page
  try {
    const customers = await Models.Customer.findAndCountAll({
      limit : 6,
      offset : pageNumber * 6,
      include : [Models.CustomerAdress, Models.TaxInfo]
    });
    
    
    res.status(200).json(customers);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({message : "An Error Occured !"});
  }
};

function isEmptyObject(obj){
  return JSON.stringify(obj) === '{}'
}

export const getFiltered = async (req, res) => {
  const queryParams = {...req.query}
  if(!isEmptyObject(queryParams)) {
    let condition  = {
      where : {},
      include :  [Models.TaxInfo, Models.CustomerAdress]
    }
    if (queryParams.account) {
      condition.where.account_id = queryParams.account
    }
  
    if(queryParams.title) {
      condition.where.account_title = {[Op.like] : `%${queryParams.title}%`
    }}
  
    if(queryParams.related) {
      condition.where.account_related = {[Op.like] : `%${queryParams.related}%`
    }}
    if(queryParams.country) {
      condition.include = [{
        model : Models.CustomerAdress,
        where : {
          customer_country : {[Op.like]  :  `%${queryParams.country}%`}
        }
      }, {model : Models.TaxInfo}]
    }
    
    try {
      const customers = await Models.Customer.findAndCountAll(condition);
      res.status(200).json(customers);
    }
  
    catch(err) {
      console.log(err);
      res.status(500).json({message : "An Error Occured !"});
    }
  } else {
    res.sendStatus(401);
  }
  
};

export default {
  createCustomer,
  updateCustomer,
  getCustomer,
  getFiltered,
  getAllCustomers,
  deleteCustomer,
  getPage
};
