import Models from "../models/index.js";
import axios from "axios";
import Sequelize, { Model } from "sequelize";
import GenerateQuotation from "../utils/generateQuotation.js";

//Done
export const createForm = async (req, res) => {
  const new_form = { ...req.body };

  try {
    const serialCount = await Models.QuotationForm.findAll({
      group: ["Customer_ID"],
      attributes: [
        "Customer_ID",
        [Sequelize.fn("count", Sequelize.col("quotation_ID")), "Count"],
      ],
      where: {
        year: parseInt(new Date().getFullYear()),
        Customer_ID: new_form.options.Customer_ID,
      },
    });

    const newDelivery = await Models.DeliveryType.create({
      ...new_form.delivery_type,
    });

    const newCreated = await Models.QuotationForm.create({
      ...new_form.options,
      day: parseInt(new Date().getDate()),
      month: parseInt(new Date().getMonth() + 1),
      year: parseInt(new Date().getFullYear()),
      reference: `T-${
        new_form.options.Customer_ID
      }-${new Date().getFullYear()}-${
        serialCount.length !== 0
          ? parseInt(serialCount[0].dataValues.Count) + 1
          : 1
      }`,
      Delivery_ID: newDelivery.delivery_ID,
    });

    const new_arr = new_form.all.map((item) => {
      return {
        ...item,
        Quotation_ID: newCreated.quotation_ID,
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
          include: [Models.StraigthBush, Models.BracketBush, Models.PlateStrip, Models.Analyze],
        },
        { model: Models.Customer },
        { model: Models.DeliveryType },
      ],
    });

    const new_form = {
        "Customer": Data.dataValues.customer.account_title,
        "Attention": Data.dataValues.customer.account_related,
        "account_id": Data.dataValues.customer.account_id,
        "Date": `${Data.dataValues.day}-${Data.dataValues.month}-${Data.dataValues.year}`,
        "customer_inq": Data.dataValues.customerInquiryNum,
        "reference": Data.dataValues.reference,
        "items": Data.dataValues.quotationItems.map((item, key) => {
            let dim = ""
            
          if (item.straight_bush === null && item.plate_strip === null) {
            dim = `${item.bracket_bush.bigger_diameter}*${item.bracket_bush.body_diameter}*${item.bracket_bush.inner_diameter}*${item.bracket_bush.bracket_length}*${item.bracket_bush.bush_length}`
            
          } if(item.plate_strip === null && item.bracket_bush === null) {
            dim = `${item.straigth_bush.large_diameter}*${item.straigth_bush.inner_diameter}*${item.straigth_bush.bush_length}`
            
          } if(item.bracket_bush === null && item.straight_bush === null) {

            dim = `${item.plate_strip.width}*${item.plate_strip["length"]}*${item.plate_strip.thickness}`
          }

          return {
            "id": key + 1,
            "description": item.description,
            "dimensions": dim,
            "analysis" : item.analyze.analyze_Name,
            "qty" : item.unit_frequence,
            "unit_price" : item.unit_price,
            "total_price" : parseInt(item.unit_frequence) * parseFloat(item.unit_price),
            "delivery" : item.deliveryTime

          }
        }),
        "grand_total_exw" : Data.dataValues.grand_total,
        "inco_name" : Data.dataValues.delivery_type.name,
        "inco_location" : Data.dataValues.delivery_type.description,
        "inco_cost" : Data.dataValues.delivery_type.total,
        "grand_total" : parseFloat(Data.dataValues.delivery_type.total) + parseFloat(Data.dataValues.grand_total),
        "validity_of_offer" : Data.dataValues.validityOfOffer,
        "incoterm_type" : Data.dataValues.IncotermType,
        "payment_terms" : Data.dataValues.PaymentTerms,
        "extra_details" : Data.dataValues.extraDetails,
        "prepared_by" : Data.dataValues.preparedBy,
        "approved_by" : Data.dataValues.approvedBy,
        "count" : parseInt(Data.dataValues.reference.split("-")[3]) - 1
      };
    
    const buf = await GenerateQuotation(new_form);
    let options = {
        root : "./files"
    }
    res.status(200).sendFile("output.docx", options);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//Todo
export const getForms = (req, res) => {};

//Todo
export const getAllForms = (req, res) => {};

//Todo
export const updateForms = (req, res) => {};
//Todo
export const deleteForms = (req, res) => {};

export default {
  createForm,
  getForms,
  getAllForms,
  updateForms,
  deleteForms,
  generateExport,
};
