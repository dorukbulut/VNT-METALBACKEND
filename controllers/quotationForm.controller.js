import Models from "../models/index.js";
import axios from "axios";
import Sequelize, { Op } from "sequelize";
import GenerateQuotation from "../utils/generateQuotation.js";
import db from "../config/database.js";

export const createForm = async (req, res) => {
  const new_form = { ...req.body };

  try {
    const serialCount = await Models.QuotationForm.findAll({
      group: ["Customer_ID", "reference"],
      attributes: [
        "reference",
        "Customer_ID",
        [Sequelize.fn("count", Sequelize.col("quotation_ID")), "Count"],
      ],
      where: {
        year: parseInt(new Date().getFullYear()),
        Customer_ID: new_form.options.Customer_ID,
      },
      distinct: true,
    });

    const newDelivery = await Models.DeliveryType.create({
      ...new_form.delivery_type,
    });

    const newCreated = await Models.QuotationForm.create({
      ...new_form.options,
      day: parseInt(new Date().getDate()),
      month: parseInt(new Date().getMonth() + 1),
      year: parseInt(new Date().getFullYear()),
      updatedAt: new Date(),
      revision: 0,
      reference: `Q-${
        new_form.options.Customer_ID
      }-${new Date().getFullYear()}-${
        serialCount.length !== 0 ? parseInt(serialCount.length) + 1 : 1
      }`,
      Delivery_ID: newDelivery.delivery_ID,
    });

    const new_arr = new_form.all.map((item) => {
      return {
        ...item,
        Quotation_ID: newCreated.quotation_ID,
        isUsed: true,
      };
    });
    const resl = await axios({
      method: "POST",
      url: "http://localhost:3001/api/quotation-items/set-quotation",
      data: {
        all: new_arr,
      },
    });

    if (resl.status === 200) {
      res.status(200).json({ message: "ok" });
    } else {
      res.status(500).json({ message: "An error occured !" });
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//Done
export const generateExport = async (req, res) => {
  const form = { ...req.body };
  try {
    const Data = await Models.QuotationForm.findOne({
      where: {
        quotation_ID: form.id,
      },

      include: [
        {
          model: Models.QuotationItem,
          include: [
            Models.StraigthBush,
            Models.BracketBush,
            Models.PlateStrip,
            Models.Analyze,
            Models.DoubleBracketBush,
            Models.MiddleBracketBush,
          ],
        },
        { model: Models.Customer },
        { model: Models.DeliveryType },
      ],
    });

    const new_form = {
      Customer: Data.dataValues.customer.account_title,
      Attention: Data.dataValues.customer.account_related,
      account_id: Data.dataValues.customer.account_id,
      Date: `${Data.dataValues.day}-${Data.dataValues.month}-${Data.dataValues.year}`,
      customer_inq: Data.dataValues.customerInquiryNum,
      reference: Data.dataValues.reference,
      items: Data.dataValues.quotationItems.map((item, key) => {
        return {
          id: key + 1,
          description: item.description,
          dimensions: item.dimensions,
          analysis: item.analyze.analyze_Name,
          qty: item.unit_frequence,
          unit_price: item.unit_price,
          total_price: (
            parseInt(item.unit_frequence) * parseFloat(item.unit_price)
          ).toFixed(2),
          delivery: item.deliveryTime,
          currency: item.currency,
        };
      }),
      grand_total_exw: parseFloat(Data.dataValues.grand_total).toFixed(2),
      inco_name: Data.dataValues.delivery_type.name,
      inco_location: Data.dataValues.delivery_type.description,
      inco_cost: parseFloat(Data.dataValues.delivery_type.total).toFixed(2),
      grand_total: (
        parseFloat(Data.dataValues.delivery_type.total) +
        parseFloat(Data.dataValues.grand_total)
      ).toFixed(2),
      validity_of_offer: Data.dataValues.validityOfOffer,
      company: Data.dataValues.company === "VNT" ? "vnt" : "bilgesin",
      language: Data.dataValues.language === "English" ? "eng" : "tr",
      incoterm_type: Data.dataValues.IncotermType,
      payment_terms: Data.dataValues.PaymentTerms,
      extra_details: Data.dataValues.extraDetails,
      prepared_by: Data.dataValues.preparedBy,
      approved_by: Data.dataValues.approvedBy,
      count: Data.dataValues.revision,
      currency: Data.dataValues.quotationItems[0].currency,
    };

    const buf = await GenerateQuotation(new_form);
    let options = {
      root: "./files",
    };
    res.status(200).sendFile("output.docx", options);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//DONE
export const getForms = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.QuotationForm.findAll({
      where: {
        [Op.or]: {
          Customer_ID: items.Customer_ID,
        },
      },
      limit: 100,
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
      include: [
        {
          model: Models.QuotationItem,
          include: [
            Models.Analyze,
            Models.BracketBush,
            Models.StraigthBush,
            Models.PlateStrip,
            Models.DoubleBracketBush,
            Models.MiddleBracketBush,
          ],
        },
        {
          model: Models.Customer,
          model: Models.DeliveryType,
        },
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const getAllForms = async (req, res) => {
  try {
    const retval = await Models.QuotationForm.findAll({
      include: [
        {
          model: Models.QuotationItem,
          include: [
            Models.Analyze,
            Models.BracketBush,
            Models.StraigthBush,
            Models.PlateStrip,
            Models.DoubleBracketBush,
            Models.MiddleBracketBush,
          ],
        },
        {
          model: Models.Customer,
          model: Models.DeliveryType,
        },
      ],
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const updateForms = async (req, res) => {
  const new_form = { ...req.body };

  const serialCount = await Models.QuotationForm.findAll({
    group: ["reference"],
    attributes: [
      "reference",
      [Sequelize.fn("count", Sequelize.col("reference")), "Count"],
    ],
    where: {
      reference: new_form.options.reference,
    },
  });

  try {
    const newDelivery = await Models.DeliveryType.create({
      ...new_form.delivery_type,
    });

    const newCreated = await Models.QuotationForm.create({
      ...new_form.options,
      day: parseInt(new Date().getDate()),
      month: parseInt(new Date().getMonth() + 1),
      year: parseInt(new Date().getFullYear()),
      updatedAt: new Date(),
      Delivery_ID: newDelivery.delivery_ID,
      revision: serialCount[0].dataValues.Count,
    });

    const new_arr = new_form.all.map((item) => {
      return {
        ...item,
        Quotation_ID: newCreated.quotation_ID,
        isUsed: true,
      };
    });
    const resl = await axios({
      method: "POST",
      url: "http://localhost:3001/api/quotation-items/set-quotation",
      data: {
        all: new_arr,
      },
    });

    if (resl.status === 200) {
      res.status(200).json({ message: "Create Revision !" });
    } else {
      res.status(500).json({ message: "An error occured !" });
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};
//DONE
export const deleteForms = async (req, res) => {
  const item = { ...req.body };

  try {
    const result = await db.transaction(async (t) => {
      const retval1 = await Models.QuotationItem.update(
        {
          Quotation_ID: null,
          isUsed: false,
        },
        {
          where: {
            Quotation_ID: item.Quotation_ID,
          },
        },
        { transaction: t }
      );

      const retval2 = await Models.SaleConfirmation.update(
        {
          Quotation_ID: null,
        },
        {
          where: {
            Quotation_ID: item.Quotation_ID,
          },
        },
        { transaction: t }
      );

      const retval3 = await Models.QuotationForm.destroy(
        {
          where: {
            quotation_ID: item.Quotation_ID,
          },

          force: true,
        },
        { transaction: t }
      );

      res.status(200).json({ message: "Form deleted" });
    });
  } catch (err) {
    res.status(500).json({ message: "An error occured !" });
  }
};

export const getByQuotation = async (req, res) => {
  const items = { ...req.body };
  try {
    const retval = await Models.QuotationForm.findAll({
      where: {
        quotation_ID: items.quotation_ID,
      },
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
      include: [
        {
          model: Models.QuotationItem,
          include: [
            Models.Analyze,
            Models.BracketBush,
            Models.StraigthBush,
            Models.PlateStrip,
            Models.DoubleBracketBush,
            Models.MiddleBracketBush,
          ],
        },
        {
          model: Models.DeliveryType,
        },
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const forms = await Models.QuotationForm.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      distinct: true,
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
    });

    res.status(200).json(forms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occured !" });
  }
};

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

export const getFiltered = async (req, res) => {
  const queryParams = { ...req.query };

  if (!isEmptyObject(queryParams)) {
    let condition = {
      where: { ...queryParams },
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
      distinct: true,
    };

    try {
      const customers = await Models.QuotationForm.findAndCountAll(condition);
      res.status(200).json(customers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/quotation-form/get-page/0");
  }
};

export default {
  createForm,
  getPage,
  getFiltered,
  getForms,
  getAllForms,
  updateForms,
  deleteForms,
  generateExport,
  getByQuotation,
};
