import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import { generateReference } from "../utils/generateReference.js";
function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const forms = await Models.ProductHeader.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      order: [["updatedAt", "DESC"]],
      include: [
        { model: Models.WorkOrder, include: [{ model: Models.QuotationItem }] },
      ],
      where: {
        isAtelierFinished: false,
      },
      distinct: true,
    });

    res.status(200).json(forms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occured !" });
  }
};

export const getFiltered = async (req, res) => {
  const queryParams = { ...req.query };
  if (!isEmptyObject(queryParams)) {
    let condition = {
      where: { ...queryParams, isAtelierFinished: false },
      order: [["updatedAt", "DESC"]],
      include: [
        { model: Models.WorkOrder, include: [{ model: Models.QuotationItem }] },
      ],
    };
    try {
      const customers = await Models.ProductHeader.findAndCountAll(condition);
      res.status(200).json(customers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/production-atelier/get-page/0");
  }
};
export const getProduct = async (req, res) => {
  const { workorder } = req.body;
  const pageNumber = req.params.page;
  try {
    const productHeader = await Models.ProductHeader.findOne({
      where: {
        WorkOrder_ID: workorder,
      },
    });
    if (productHeader) {
      const workOrder = await Models.WorkOrder.findOne({
        where: { workorder_ID: workorder },
        include: [
          { model: Models.QuotationItem, include: [{ model: Models.Analyze }] },
        ],
      });
      const products = await Models.Products.findAndCountAll({
        limit: 6,
        offset: pageNumber * 6,
        order: [["step", "ASC"]],
        where: {
          ProductHeader_ID: productHeader.header_id,
          isQC: "accepted",
          atelier: "İç Atölye",
        },
        attributes: [
          "step",
          "product_id",
          "charge_number",
          "n_piece",
          "piece_kg",
          "total_kg",
          "isQC",
          "preparedBy",
        ],
        distinct: true,
      });

      const analyze = workOrder.quotationItem.analyze.dataValues.analyze_Name;
      const WorkOrderReference =
        workOrder.reference + "-REV-" + workOrder.revision.toString();
      const customer = workOrder.dataValues.Customer_ID;
      res.status(200).send({
        productHeader,
        analyze,
        customer,
        products,
        WorkOrderReference,
      });
    } else {
      res.status(200).send([]);
    }
  } catch (err) {
    console.log(err);
    res.status(405).send({ message: "Internal Server Error" });
  }
};

export default {
  getPage,
  getFiltered,
  getProduct,
};
