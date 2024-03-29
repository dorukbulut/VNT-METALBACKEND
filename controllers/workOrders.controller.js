import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import GenerateWorkOrder from "../utils/generateWorkOrder.js";

const create = async (new_order) => {
  const serialCount = await Models.WorkOrder.findAll({
    group: ["Customer_ID", "reference"],
    attributes: [
      "Customer_ID",
      "reference",
      [Sequelize.fn("count", Sequelize.col("workorder_ID")), "Count"],
    ],
    where: {
      year: parseInt(new Date().getFullYear()),
      Customer_ID: new_order.options.Customer_ID,
    },
    distinct: true,
  });

  const newCreated = await Models.WorkOrder.create({
    ...new_order.options,
    year: parseInt(new Date().getFullYear()),
    day: parseInt(new Date().getDate()),
    month: parseInt(new Date().getMonth() + 1),
    revision: 0,
    updatedAt: new Date(),
    reference: `WORN-${
      new_order.options.Customer_ID
    }-${new Date().getFullYear()}-${
      serialCount.length !== 0 ? parseInt(serialCount.length) + 1 : 1
    }`,
  });
};

const update = async (order) => {
  const serialCount = await Models.WorkOrder.findAll({
    group: ["reference"],
    attributes: [
      "reference",
      [Sequelize.fn("count", Sequelize.col("reference")), "Count"],
    ],
    where: {
      reference: order.options.reference,
    },
  });

  const newCreated = await Models.WorkOrder.create({
    ...order.options,
    year: parseInt(new Date().getFullYear()),
    day: parseInt(new Date().getDate()),
    month: parseInt(new Date().getMonth() + 1),
    updatedAt: new Date(),
    revision: serialCount[0].dataValues.Count,
  });
};

//DONE
export const createWorkOrder = async (req, res) => {
  const new_order = { ...req.body };
  try {
    await create(new_order);
    res.status(200).json({ message: "New Work Order Created !" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const updateWorkOrder = async (req, res) => {
  const order = { ...req.body };
  try {
    await update(order);
    res.status(200).json({ message: "Work Order Updated !" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const getWorkOrder = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.WorkOrder.findAll({
      where: {
        [Op.or]: {
          Customer_ID: items.Customer_ID,
        },
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
          model: Models.SaleConfirmation,
          include: [
            {
              model: Models.QuotationForm,
              include: [Models.DeliveryType],
            },
            Models.Certificate,
          ],
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
export const getAllWorkOrder = async (req, res) => {
  try {
    const retval = await Models.WorkOrder.findAll({
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
          model: Models.SaleConfirmation,
          include: [
            {
              model: Models.QuotationForm,
              include: [Models.DeliveryType],
            },
            Models.Certificate,
          ],
        },
        {
          model: Models.Customer,
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
export const generateWorkOrder = async (req, res) => {
  const item = { ...req.body };
  try {
    switch (item.type) {
      //DONE
      case "straight_bush":
        const retval = await Models.WorkOrder.findOne({
          where: {
            workorder_ID: item.id,
          },
          include: [
            {
              model: Models.QuotationItem,
              include: [Models.Analyze, Models.StraigthBush],
            },
            {
              model: Models.SaleConfirmation,
              include: [
                {
                  model: Models.QuotationForm,
                  include: [Models.DeliveryType],
                },
                Models.Certificate,
              ],
            },
            {
              model: Models.Customer,
            },
          ],
        });
        const new_form = {
          reference: retval.dataValues.reference,
          qty: retval.dataValues.quotationItem.unit_frequence,
          deliveryDate: retval.dataValues.sale_confirmation.deliveryDate,
          analysis: retval.dataValues.quotationItem.analyze.analyze_Name,
          company: retval.dataValues.company === "VNT" ? "vnt" : "bilgesin",
          customer_reference:
            retval.dataValues.sale_confirmation.customerReference,
          description: retval.dataValues.sale_confirmation.description,
          specials: retval.dataValues.sale_confirmation.specialOffers,
          date: `${retval.dataValues.day}-${retval.dataValues.month}-${retval.dataValues.year}`,
          big_dia: retval.dataValues.quotationItem.straight_bush.large_diameter,
          inner: retval.dataValues.quotationItem.straight_bush.inner_diameter,
          length: retval.dataValues.quotationItem.straight_bush.bush_length,
          calc_weigth: retval.dataValues.quotationItem.calcRaw,
          treament_firm: retval.dataValues.quotationItem.treatment_firm,
          model_firm: retval.dataValues.quotationItem.model_firm,
          packaging: retval.dataValues.sale_confirmation.package
            ? "Var"
            : "Yok",
          hasPackage: retval.dataValues.sale_confirmation.package,
          certificates: retval.dataValues.sale_confirmation.certificates.map(
            (item) => {
              return {
                certificate: item.name,
              };
            }
          ),
          revision: retval.dataValues.revision,
        };
        const buf = await GenerateWorkOrder(new_form, "straightbush_template");
        let options = {
          root: "./files",
        };
        res.status(200).sendFile("output3.docx", options);

        break;
      //DONE
      case "bracket_bush":
        const retval1 = await Models.WorkOrder.findOne({
          where: {
            workorder_ID: item.id,
          },
          include: [
            {
              model: Models.QuotationItem,
              include: [Models.Analyze, Models.BracketBush],
            },
            {
              model: Models.SaleConfirmation,
              include: [
                {
                  model: Models.QuotationForm,
                  include: [Models.DeliveryType],
                },
                Models.Certificate,
              ],
            },
            {
              model: Models.Customer,
            },
          ],
        });
        const new_form1 = {
          reference: retval1.dataValues.reference,
          qty: retval1.dataValues.quotationItem.unit_frequence,
          deliveryDate: retval1.dataValues.sale_confirmation.deliveryDate,
          analysis: retval1.dataValues.quotationItem.analyze.analyze_Name,
          customer_reference:
            retval1.dataValues.sale_confirmation.customerReference,
          description: retval1.dataValues.sale_confirmation.description,
          specials: retval1.dataValues.sale_confirmation.specialOffers,
          date: `${retval1.dataValues.day}-${retval1.dataValues.month}-${retval1.dataValues.year}`,
          Q1: retval1.dataValues.quotationItem.bracket_bush.bigger_diameter,
          Q2: retval1.dataValues.quotationItem.bracket_bush.inner_diameter,
          Q3: retval1.dataValues.quotationItem.bracket_bush.body_diameter,
          L1: retval1.dataValues.quotationItem.bracket_bush.bracket_length,
          L: retval1.dataValues.quotationItem.bracket_bush.bush_length,
          calc_weigth: retval1.dataValues.quotationItem.calcRaw,
          treament_firm: retval1.dataValues.quotationItem.treatment_firm,
          model_firm: retval1.dataValues.quotationItem.model_firm,
          packaging: retval1.dataValues.sale_confirmation.package
            ? "Var"
            : "Yok",
          hasPackage: retval1.dataValues.sale_confirmation.package,
          company: retval1.dataValues.company === "VNT" ? "vnt" : "bilgesin",
          certificates: retval1.dataValues.sale_confirmation.certificates.map(
            (item) => {
              return {
                certificate: item.name,
              };
            }
          ),
          revision: retval1.dataValues.revision,
        };
        const buf1 = await GenerateWorkOrder(
          new_form1,
          "bracket_bush_template"
        );
        let options1 = {
          root: "./files",
        };
        res.status(200).sendFile("output3.docx", options1);
        break;

      //DONE
      case "plate_strip":
        const retval2 = await Models.WorkOrder.findOne({
          where: {
            workorder_ID: item.id,
          },
          include: [
            {
              model: Models.QuotationItem,
              include: [Models.Analyze, Models.PlateStrip],
            },
            {
              model: Models.SaleConfirmation,
              include: [
                {
                  model: Models.QuotationForm,
                  include: [Models.DeliveryType],
                },
                Models.Certificate,
              ],
            },
            {
              model: Models.Customer,
            },
          ],
        });
        const new_form2 = {
          reference: retval2.dataValues.reference,
          qty: retval2.dataValues.quotationItem.unit_frequence,
          deliveryDate: retval2.dataValues.sale_confirmation.deliveryDate,
          analysis: retval2.dataValues.quotationItem.analyze.analyze_Name,
          customer_reference:
            retval2.dataValues.sale_confirmation.customerReference,
          description: retval2.dataValues.sale_confirmation.description,
          specials: retval2.dataValues.sale_confirmation.specialOffers,
          date: `${retval2.dataValues.day}-${retval2.dataValues.month}-${retval2.dataValues.year}`,
          plate_model_size: retval2.dataValues.plate_model_size,
          treatment_firm_dim: retval2.dataValues.treatment_size,
          dimensions: retval2.dataValues.quotationItem.dimensions,
          calc_weigth: retval2.dataValues.quotationItem.calcRaw,
          treament_firm: retval2.dataValues.quotationItem.treatment_firm,
          model_firm: retval2.dataValues.quotationItem.model_firm,
          packaging: retval2.dataValues.sale_confirmation.package
            ? "Var"
            : "Yok",
          hasPackage: retval2.dataValues.sale_confirmation.package,
          company: retval2.dataValues.company === "VNT" ? "vnt" : "bilgesin",
          certificates: retval2.dataValues.sale_confirmation.certificates.map(
            (item) => {
              return {
                certificate: item.name,
              };
            }
          ),
          revision: retval2.dataValues.revision,
        };
        const buf2 = await GenerateWorkOrder(new_form2, "plate_strip_template");
        let options2 = {
          root: "./files",
        };
        res.status(200).sendFile("output3.docx", options2);
        break;

      //DONE
      case "middlebracket_bush":
        const retval3 = await Models.WorkOrder.findOne({
          where: {
            workorder_ID: item.id,
          },
          include: [
            {
              model: Models.QuotationItem,
              include: [Models.Analyze, Models.MiddleBracketBush],
            },
            {
              model: Models.SaleConfirmation,
              include: [
                {
                  model: Models.QuotationForm,
                  include: [Models.DeliveryType],
                },
                Models.Certificate,
              ],
            },
            {
              model: Models.Customer,
            },
          ],
        });
        const new_form3 = {
          reference: retval3.dataValues.reference,
          qty: retval3.dataValues.quotationItem.unit_frequence,
          deliveryDate: retval3.dataValues.sale_confirmation.deliveryDate,
          analysis: retval3.dataValues.quotationItem.analyze.analyze_Name,
          customer_reference:
            retval3.dataValues.sale_confirmation.customerReference,
          description: retval3.dataValues.sale_confirmation.description,
          specials: retval3.dataValues.sale_confirmation.specialOffers,
          date: `${retval3.dataValues.day}-${retval3.dataValues.month}-${retval3.dataValues.year}`,
          Q1: retval3.dataValues.quotationItem.middlebracket_bush.bracket_q1,
          Q2: retval3.dataValues.quotationItem.middlebracket_bush.bracket_q2,
          Q3: retval3.dataValues.quotationItem.middlebracket_bush.bracket_q3,
          Q4: retval3.dataValues.quotationItem.middlebracket_bush.bracket_q4,
          L1: retval3.dataValues.quotationItem.middlebracket_bush.bracket_l1,
          L2: retval3.dataValues.quotationItem.middlebracket_bush.bracket_l2,
          L3: retval3.dataValues.quotationItem.middlebracket_bush.bracket_l3,
          company: retval3.dataValues.company,
          L: retval3.dataValues.quotationItem.middlebracket_bush.bracket_full,
          calc_weigth: retval3.dataValues.quotationItem.calcRaw,
          treament_firm: retval3.dataValues.quotationItem.treatment_firm,
          model_firm: retval3.dataValues.quotationItem.model_firm,
          company: retval3.dataValues.company === "VNT" ? "vnt" : "bilgesin",
          packaging: retval3.dataValues.sale_confirmation.package
            ? "Var"
            : "Yok",
          hasPackage: retval3.dataValues.sale_confirmation.package,
          certificates: retval3.dataValues.sale_confirmation.certificates.map(
            (item) => {
              return {
                certificate: item.name,
              };
            }
          ),
          revision: retval3.dataValues.revision,
        };
        const buf3 = await GenerateWorkOrder(
          new_form3,
          "middlebracket_bush_template"
        );
        let options3 = {
          root: "./files",
        };
        res.status(200).sendFile("output3.docx", options3);
        break;
      //DONE
      case "doublebracket_bush":
        const retval4 = await Models.WorkOrder.findOne({
          where: {
            workorder_ID: item.id,
          },
          include: [
            {
              model: Models.QuotationItem,
              include: [Models.Analyze, Models.DoubleBracketBush],
            },
            {
              model: Models.SaleConfirmation,
              include: [
                {
                  model: Models.QuotationForm,
                  include: [Models.DeliveryType],
                },
                Models.Certificate,
              ],
            },
            {
              model: Models.Customer,
            },
          ],
        });
        const new_form4 = {
          reference: retval4.dataValues.reference,
          qty: retval4.dataValues.quotationItem.unit_frequence,
          deliveryDate: retval4.dataValues.sale_confirmation.deliveryDate,
          analysis: retval4.dataValues.quotationItem.analyze.analyze_Name,
          customer_reference:
            retval4.dataValues.sale_confirmation.customerReference,
          description: retval4.dataValues.sale_confirmation.description,
          specials: retval4.dataValues.sale_confirmation.specialOffers,
          date: `${retval4.dataValues.day}-${retval4.dataValues.month}-${retval4.dataValues.year}`,
          Q1: retval4.dataValues.quotationItem.doublebracket_bush
            .bigger_diameter,
          Q2: retval4.dataValues.quotationItem.doublebracket_bush.body_diameter,
          Q3: retval4.dataValues.quotationItem.doublebracket_bush
            .inner_diameter,
          L1: retval4.dataValues.quotationItem.doublebracket_bush.bracket_l1,
          L2: retval4.dataValues.quotationItem.doublebracket_bush.bracket_l2,
          L3: retval4.dataValues.quotationItem.doublebracket_bush.bracket_l3,
          L: retval4.dataValues.quotationItem.doublebracket_bush.bracket_full,
          calc_weigth: retval4.dataValues.quotationItem.calcRaw,
          treament_firm: retval4.dataValues.quotationItem.treatment_firm,
          model_firm: retval4.dataValues.quotationItem.model_firm,
          packaging: retval4.dataValues.sale_confirmation.package
            ? "Var"
            : "Yok",
          hasPackage: retval4.dataValues.sale_confirmation.package,
          company: retval4.dataValues.company === "VNT" ? "vnt" : "bilgesin",
          certificates: retval4.dataValues.sale_confirmation.certificates.map(
            (item) => {
              return {
                certificate: item.name,
              };
            }
          ),
          revision: retval4.dataValues.revision,
        };
        const buf4 = await GenerateWorkOrder(
          new_form4,
          "doublebracket_bush_template"
        );
        let options4 = {
          root: "./files",
        };
        res.status(200).sendFile("output3.docx", options4);
        break;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

//DONE
export const deleteWorkOrder = async (req, res) => {
  const item = { ...req.body };

  try {
    const retval2 = await Models.WorkOrder.destroy({
      where: {
        workorder_ID: item.workorder_ID,
      },

      force: true,
    });

    res.status(200).json({ message: "Work Order Deleted !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured !" });
  }
};

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const forms = await Models.WorkOrder.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
      include: [Models.QuotationItem],
      distinct: true,
    });

    res.status(200).json(forms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occured !" });
  }
};

export const getByWorkOrder = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.WorkOrder.findAll({
      where: {
        [Op.or]: {
          workorder_ID: items.workorder_ID,
        },
      },
      include: [Models.QuotationItem],
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
          model: Models.SaleConfirmation,
          include: [
            {
              model: Models.QuotationForm,
              include: [Models.DeliveryType],
            },
            Models.Certificate,
          ],
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

function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

export const getFiltered = async (req, res) => {
  const queryParams = { ...req.query };
  if (!isEmptyObject(queryParams)) {
    let condition = {
      where: { ...queryParams },
      include: [Models.QuotationItem],
      order: [
        ["updatedAt", "DESC"],
        ["revision", "ASC"],
      ],
    };
    try {
      const customers = await Models.WorkOrder.findAndCountAll(condition);
      res.status(200).json(customers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/work-order/get-page/0");
  }
};

export const setTrue = async (req, res) => {
  const { id } = req.body;
  try {
    const retval = await Models.WorkOrder.update(
      { isProduct: true },
      {
        where: {
          workorder_ID: id,
        },
      }
    );

    res.status(200).json({ message: "Setted tot true" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const setFalse = async (req, res) => {
  const { id } = req.body;
  try {
    const retval = await Models.WorkOrder.update(
      { isProduct: false },
      {
        where: {
          workorder_ID: id,
        },
      }
    );

    res.status(200).json({ message: "Setted to false" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export default {
  getFiltered,
  getPage,
  createWorkOrder,
  updateWorkOrder,
  getWorkOrder,
  getAllWorkOrder,
  generateWorkOrder,
  deleteWorkOrder,
  getByWorkOrder,
  setTrue,
  setFalse,
};
