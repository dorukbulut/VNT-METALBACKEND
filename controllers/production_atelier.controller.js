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
      const ateliers = await Models.Process.findAndCountAll({
        limit: 6,
        offset: pageNumber * 6,
        order: [["step", "ASC"]],
        where: {
          ProductHeader_ID: productHeader.header_id,
        },
        attributes: [
          "step",
          "atelier_id",
          "n_piece",
          "total_kg",
          "atelier_dims",
          "isQC",
          "preparedBy",
        ],
        distinct: true,
      })
      res.status(200).send({
        productHeader,
        analyze,
        customer,
        products,
        ateliers,
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

export const createProduct = async (req, res) => {
  try {
    let new_product = { ...req.body };
    const productCount = await Models.Process.count({
      where: {
        ProductHeader_ID: new_product.ProductHeader_ID,
      },
    });

    const product = await Models.Process.create({
      ...new_product,
      step: productCount + 1,
      isQC: "pending",
    });

    res.status(200).json({ message: "created record" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = { ...req.body };
    delete product.isQC;
    delete product.WorkOrder_ID;
    delete product.step;
    delete product.total_kg;
    delete product.createdAt;
    delete product.updatedAt;
    const product_id = product.product_id;
    delete product.product_id;

    // Find the product record
    const old_product = await Models.Products.findByPk(product_id);

    // Find the product header
    const productHeader = await Models.ProductHeader.findOne({
      where: { header_id: old_product.ProductHeader_ID },
    });

    if (old_product && productHeader) {
      //Update the product header
      productHeader.n_piece =
          parseInt(productHeader.n_piece) +
          parseInt(product.n_piece) -
          parseInt(old_product.n_piece);
      productHeader.total_kg =
          parseFloat(productHeader.total_kg) +
          (parseFloat(product.n_piece) * parseFloat(product.piece_kg) +
              parseFloat(product.extra_kg) +
              parseFloat(product.sawdust_kg)) -
          (parseFloat(old_product.n_piece) * parseFloat(old_product.piece_kg) +
              parseFloat(old_product.extra_kg) +
              parseFloat(old_product.sawdust_kg));
      productHeader.n_remaining =
          parseInt(productHeader.n_remaining) -
          parseInt(product.n_piece) +
          parseInt(old_product.n_piece);
      await productHeader.save();

      //Update the record
      await old_product.update({
        ...product,
        total_kg:
            parseFloat(product.n_piece) * parseFloat(product.piece_kg) +
            parseFloat(product.extra_kg) +
            parseFloat(product.sawdust_kg),
        isQC: "pending",
      });

      await old_product.save();
      res.status(200).json({ message: "Updated Record" });
    }
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export default {
  getPage,
  getFiltered,
  getProduct,
  createProduct,
  updateProduct,
};
