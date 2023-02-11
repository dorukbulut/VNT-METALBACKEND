import Models from "../models/index.js";
import axios from "axios";
import Sequelize, { Op } from "sequelize";
import GenerateConfirmation from "../utils/generateConfirmation.js";

//DONE
export const createForm = async (req, res) => {
  const new_confirmation = { ...req.body };
  try {
    const serialCount = await Models.SaleConfirmation.findAll({
      group: ["Customer_ID", "reference"],
      attributes: [
        "Customer_ID",
        "reference",
        [Sequelize.fn("count", Sequelize.col("sale_ID")), "Count"],
      ],
      where: {
        year: parseInt(new Date().getFullYear()),
        Customer_ID: new_confirmation.options.Customer_ID,
      },
      distinct: true,
    });

    const newCreated = await Models.SaleConfirmation.create({
      ...new_confirmation.options,
      year: parseInt(new Date().getFullYear()),
      day: parseInt(new Date().getDate()),
      month: parseInt(new Date().getMonth() + 1),
      revision: 0,
      reference: `ORN-${
        new_confirmation.options.Customer_ID
      }-${new Date().getFullYear()}-${
        serialCount.length !== 0 ? parseInt(serialCount.length) + 1 : 1
      }`,
    });
    const new_arr = new_confirmation.cert_options.map((item) => {
      return {
        ...item,
        Sale_ID: newCreated.sale_ID,
      };
    });
    const newCertificate = await Models.Certificate.bulkCreate(new_arr);
    res.status(200).json({ message: "Sale Confirmation Created !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};
//DONE
export const updateForm = async (req, res) => {
  const new_confirmation = { ...req.body };
  try {
    const serialCount = await Models.SaleConfirmation.findAll({
      group: ["reference"],
      attributes: [
        "reference",
        [Sequelize.fn("count", Sequelize.col("reference")), "Count"],
      ],
      where: {
        reference: new_confirmation.options.reference,
      },
    });
    const newCreated = await Models.SaleConfirmation.create({
      ...new_confirmation.options,
      year: parseInt(new Date().getFullYear()),
      day: parseInt(new Date().getDate()),
      month: parseInt(new Date().getMonth() + 1),
      revision: serialCount[0].dataValues.Count,
    });

    const new_arr = new_confirmation.cert_options.map((item) => {
      return {
        ...item,
        Sale_ID: newCreated.sale_ID,
      };
    });
    const newCertificate = await Models.Certificate.bulkCreate(new_arr);

    res.status(200).json({ message: "NewSale confirmation Created !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//DONE
export const generateForm = async (req, res) => {
  const form = { ...req.body };
  try {
    const Data = await Models.SaleConfirmation.findOne({
      where: {
        sale_ID: form.id,
      },

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
          model: Models.QuotationForm,
          include: [Models.DeliveryType],
        },

        {
          model: Models.Certificate,
        },
        {
          model: Models.Customer,
        },
      ],
    });

    const quot_item = [];
    quot_item.push(Data.dataValues.quotationItem);
    const new_form = {
      order_number: Data.dataValues.reference,
      account_title: Data.dataValues.customer.account_title,
      account_id: Data.dataValues.Customer_ID,
      quot_data: `${parseInt(Data.dataValues.quotation_form.day)}- ${parseInt(
        Data.dataValues.quotation_form.month
      )}-${parseInt(Data.dataValues.quotation_form.year)}`,
      specials: Data.dataValues.specialOffers,
      order_date: Data.dataValues.OrderDate,
      delivery_date: Data.dataValues.deliveryDate,
      customer_reference: Data.dataValues.customerReference,
      items: quot_item.map((item, key) => {
        let dim = "";
        let p_calc = 0;

        if (
          item.straight_bush === null &&
          item.plate_strip === null &&
          item.doublebracket_bush === null &&
          item.middlebracket_bush === null
        ) {
          dim = `${item.bracket_bush.bigger_diameter}*${item.bracket_bush.body_diameter}*${item.bracket_bush.inner_diameter}*${item.bracket_bush.bracket_length}*${item.bracket_bush.bush_length}`;
          p_calc =
            ((parseFloat(item.bracket_bush.bigger_diameter) / 2) *
              (parseFloat(item.bracket_bush.bigger_diameter) / 2) *
              3.14 *
              parseFloat(item.bracket_bush.bracket_length) *
              8.6 -
              (parseFloat(item.bracket_bush.body_diameter) / 2) *
                (parseFloat(item.bracket_bush.body_diameter) / 2) *
                3.14 *
                parseFloat(item.bracket_bush.bracket_length) *
                8,
            6) /
              1000000 +
            ((parseFloat(item.bracket_bush.body_diameter) / 2) *
              (parseFloat(item.bracket_bush.body_diameter) / 2) *
              3.14 *
              parseFloat(item.bracket_bush.bush_length) *
              8.6 -
              (parseFloat(item.bracket_bush.inner_diameter) / 2) *
                (parseFloat(item.bracket_bush.inner_diameter) / 2) *
                3.14 *
                item.bracket_bush.bush_length *
                8.6) /
              1000000;
        }
        if (
          item.plate_strip === null &&
          item.bracket_bush === null &&
          item.doublebracket_bush === null &&
          item.middlebracket_bush === null
        ) {
          dim = `${item.straight_bush.large_diameter}*${item.straight_bush.inner_diameter}*${item.straight_bush.bush_length}`;
          p_calc = parseFloat(
            (parseFloat(item.straight_bush.large_diameter) *
              parseFloat(item.straight_bush.large_diameter) *
              3.14 *
              parseFloat(item.straight_bush.bush_length) *
              8.6 -
              (parseFloat(item.straight_bush.inner_diameter) / 2) *
                (parseFloat(item.straight_bush.inner_diameter) / 2) *
                3.14 *
                parseFloat(item.straight_bush.bush_length) *
                8.6) /
              1000000
          );
        }
        if (
          item.bracket_bush === null &&
          item.straight_bush === null &&
          item.doublebracket_bush === null &&
          item.middlebracket_bush === null
        ) {
          p_calc = parseFloat(
            (parseFloat(item.plate_strip.width) *
              parseFloat(item.plate_strip["length"]) *
              parseFloat(item.plate_strip.thickness) *
              8.6) /
              1000000
          );
          dim = `${item.plate_strip.width}*${item.plate_strip["length"]}*${item.plate_strip.thickness}`;
        }
        if (
          item.bracket_bush === null &&
          item.straight_bush === null &&
          item.plate_strip === null &&
          item.middlebracket_bush === null
        ) {
          dim = `${item.doublebracket_bush.bigger_diameter}*${item.doublebracket_bush.body_diameter}*${item.doublebracket_bush.inner_diameter}*${item.doublebracket_bush.bracket_l1}*${item.doublebracket_bush.bracket_l2}*${item.doublebracket_bush.bracket_l3}*${item.doublebracket_bush.bracket_full}`;
          p_calc =
            ((parseFloat(item.doublebracket_bush.bigger_diameter) / 2) *
              (parseFloat(item.doublebracket_bush.bigger_diameter) / 2) *
              3.14 *
              8.6 *
              parseFloat(item.doublebracket_bush.bracket_l1) -
              (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                3.14 *
                8.6 *
                parseFloat(item.doublebracket_bush.bracket_l1)) /
              1000000 +
            ((parseFloat(item.doublebracket_bush.body_diameter) / 2) *
              (parseFloat(item.doublebracket_bush.body_diameter) / 2) *
              3.14 *
              8.6 *
              parseFloat(item.doublebracket_bush.bracket_l3) -
              (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                3.14 *
                8.6 *
                parseFloat(item.doublebracket_bush.bracket_l3)) /
              1000000 +
            ((parseFloat(item.doublebracket_bush.bigger_diameter) / 2) *
              (parseFloat(item.doublebracket_bush.bigger_diameter) / 2) *
              3.14 *
              8.6 *
              parseFloat(item.doublebracket_bush.bracket_l2) -
              (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                (parseFloat(item.doublebracket_bush.inner_diameter) / 2) *
                3.14 *
                8.6 *
                parseFloat(item.doublebracket_bush.bracket_l2)) /
              1000000;
        }
        if (
          item.bracket_bush === null &&
          item.straight_bush === null &&
          item.plate_strip === null &&
          item.doublebracket_bush === null
        ) {
          dim = `${item.middlebracket_bush.bracket_q1}*${item.middlebracket_bush.bracket_q2}*${item.middlebracket_bush.bracket_q3}*${item.middlebracket_bush.bracket_q4}*${item.middlebracket_bush.bracket_l1}*${item.middlebracket_bush.bracket_l2}*${item.middlebracket_bush.bracket_l3}*${item.middlebracket_bush.bracket_full}`;
          let A8 = parseFloat(item.middlebracket_bush.bracket_q1);
          let B8 = parseFloat(item.middlebracket_bush.bracket_q3);
          let C8 = parseFloat(item.middlebracket_bush.bracket_q2);
          let D8 = parseFloat(item.middlebracket_bush.bracket_q4);
          let E8 = parseFloat(item.middlebracket_bush.bracket_l1);
          let F8 = parseFloat(item.middlebracket_bush.bracket_l2);
          let G8 = parseFloat(item.middlebracket_bush.bracket_l3);
          let H8 = parseFloat(item.middlebracket_bush.bracket_full);
          p_calc =
            ((A8 / 2) * (A8 / 2) * 3.14 * 8.6 * E8 -
              (B8 / 2) * (B8 / 2) * 3.14 * 8.6 * E8) /
              1000000 +
            ((A8 / 2) * (A8 / 2) * 3.14 * 8.6 * G8 -
              (C8 / 2) * (C8 / 2) * 3.14 * 8.6 * G8) /
              1000000 +
            ((A8 / 2) * (A8 / 2) * 3.14 * 8.6 * F8 -
              (D8 / 2) * (D8 / 2) * 3.14 * 8.6 * F8) /
              1000000;
        }

        return {
          p_description: item.description,
          p_dim: dim,
          p_analys: item.analyze.analyze_Name,
          p_qty: item.unit_frequence,
          p_unit: item.unit_price,
          p_n_des: Data.dataValues.description,
          p_calc: p_calc,
        };
      }),
      firm_name: Data.dataValues.quotationItem.treatment_firm,
      treatment_price: Data.dataValues.quotationItem.treatment_price,
      model_firm: Data.dataValues.quotationItem.model_firm,
      model_price: Data.dataValues.quotationItem.model_price,
      certs: Data.dataValues.certificates.map((item) => {
        return {
          certificate: item.name,
        };
      }),
      delivery_type: Data.dataValues.quotation_form.delivery_type.name,
      packaging: Data.dataValues.package,
      company: Data.dataValues.company === "VNT" ? "vnt" : "bilgesin",
      language: Data.dataValues.language === "English" ? "eng" : "tr",
      hasPackage: Data.dataValues.package,
      revision: Data.dataValues.revision,
    };

    const buf = await GenerateConfirmation(new_form);
    let options = {
      root: "./files",
    };
    res.status(200).sendFile("output2.docx", options);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//DONE
export const deleteForm = async (req, res) => {
  const item = { ...req.body };

  try {
    const retval1 = await Models.WorkOrder.update(
      {
        Sale_ID: null,
      },
      {
        where: {
          Sale_ID: item.Sale_ID,
        },
      }
    );

    const retval2 = await Models.SaleConfirmation.destroy({
      where: {
        sale_ID: item.Sale_ID,
      },

      force: true,
    });

    res.status(200).json({ message: "Sale Confirmation Deleted !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

export const getByConfirmation = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.SaleConfirmation.findAll({
      where: {
        sale_ID: items.sale_ID,
      },
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
          model: Models.QuotationForm,
          include: [Models.DeliveryType],
        },

        {
          model: Models.Certificate,
        },
        {
          model: Models.Customer,
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
export const getForms = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.SaleConfirmation.findAll({
      where: {
        [Op.or]: {
          Customer_ID: items.Customer_ID,
        },
      },
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
          model: Models.QuotationForm,
          include: [Models.DeliveryType],
        },

        {
          model: Models.Certificate,
        },
        {
          model: Models.Customer,
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
export const getAll = async (req, res) => {
  try {
    const retval = await Models.SaleConfirmation.findAll({
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
          model: Models.QuotationForm,
          include: [Models.DeliveryType],
        },

        {
          model: Models.Certificate,
        },
        {
          model: Models.Customer,
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
    const forms = await Models.SaleConfirmation.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      distinct: true,
      include: [
        {
          model: Models.QuotationForm,
        },
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
      where: {},
      include: [
        {
          model: Models.QuotationForm,
        },
      ],
    };
    if (queryParams.account) {
      condition.where.Customer_ID = queryParams.account;
    }

    if (queryParams.saleReference) {
      condition.where.reference = queryParams.saleReference;
    }

    if (queryParams.quotReference) {
      condition.include = [
        {
          model: Models.QuotationForm,
          where: {
            reference: `${queryParams.quotReference}`,
          },
        },
      ];
    }
    if (queryParams.date) {
      let new_date = new Date(queryParams.date);
      condition.where.day = new_date.getDate();
      condition.where.month = new_date.getMonth() + 1;
      condition.where.year = new_date.getFullYear();
    }

    try {
      const customers = await Models.SaleConfirmation.findAndCountAll(
        condition
      );
      res.status(200).json(customers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/sale-confirmation/get-page/0");
  }
};

export default {
  getPage,
  getFiltered,
  createForm,
  updateForm,
  generateForm,
  getByConfirmation,
  deleteForm,
  getForms,
  getAll,
};
