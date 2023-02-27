import Customer from "../models/customer.model.js";
import TaxInfo from "../models/taxinfo.model.js";
import CustomerAdress from "../models/customerAdress.model.js";
import Models from "../models/index.js";
import { Op } from "sequelize";
import db from "../config/database.js";
import { isEmptyObject } from "../utils/isEmptyObject.js";

export const createCustomer = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const newCustomer = { ...req.body };
      const created = await Customer.create(
        {
          ...newCustomer.customer,
          tax_info: {
            ...newCustomer.taxinfo,
          },

          customer_adress: {
            ...newCustomer.adressinfo,
          },
        },
        {
          transaction: t,
          include: [
            { model: Models.CustomerAdress },
            { model: Models.TaxInfo },
          ],
        }
      );
      return 0;
    });

    res.status(200).json({ message: "Customer created." });
  } catch (err) {
    res.status(500).json({ message: "An error occured." });
  }
};

export const updateCustomer = async (req, res) => {
  const customer = { ...req.body };
  try {
    const result = await db.transaction(async (t) => {
      if (
        Customer.findOne(
          { where: { account_id: customer.account_id } },
          { transaction: t }
        )
      ) {
        const update = await Customer.update(
          {
            ...customer.customer,
            tax_info: {
              ...customer.taxinfo,
            },
            customer_adress: {
              ...customer.adressinfo,
            },
          },
          {
            where: { account_id: customer.account_id },
          },
          {
            transaction: t,
            include: [
              Models.TaxInfo,
              Models.CustomerAdress,
              Models.QuotationForm,
              Models.QuotationItem,
              Models.SaleConfirmation,
              Models.WorkOrder,
            ],
          }
        );
        res.status(200).json({ message: "Customer updated" });
      } else {
        res.status(401).json({ message: "Cannot find customer" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred." });
  }
};

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

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ attributes: ["account_id"] });
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

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const customers = await Models.Customer.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
    });

    res.status(200).json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occured !" });
  }
};

export const getFiltered = async (req, res) => {
  const queryParams = { ...req.query };
  if (!isEmptyObject(queryParams)) {
    let condition = {
      where: { ...queryParams },
    };
    try {
      const customers = await Models.Customer.findAndCountAll(condition);
      res.status(200).json(customers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/customer/get-page/0");
  }
};

export default {
  createCustomer,
  updateCustomer,
  getCustomer,
  getFiltered,
  getAllCustomers,
  getPage,
};
