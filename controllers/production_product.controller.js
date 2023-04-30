import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import { generateReference } from "../utils/generateReference.js";
function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const forms = await Models.WorkOrder.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      where: {
        status: "pending",
        isProduct: true,
      },
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

export const getFiltered = async (req, res) => {
  const queryParams = { ...req.query };
  if (!isEmptyObject(queryParams)) {
    let condition = {
      where: { ...queryParams, status: "pending", isProduct: true },
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
    res.redirect("/api/production-product/get-page/0");
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
      const customer = workOrder.dataValues.Customer_ID;
      res.status(200).send({ productHeader, analyze, customer, products });
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
    // Find the product header
    let productHeader = await Models.ProductHeader.findOne({
      where: { WorkOrder_ID: new_product.WorkOrder_ID },
    });

    // Update the product header
    if (productHeader) {
      productHeader.n_piece =
        parseInt(productHeader.n_piece) + parseInt(new_product.n_piece);
      productHeader.total_kg =
        parseFloat(productHeader.total_kg) +
        parseFloat(new_product.n_piece) * parseFloat(new_product.piece_kg) +
        parseFloat(new_product.extra_kg) +
        parseFloat(new_product.sawdust_kg);
      productHeader.n_remaining =
        parseInt(productHeader.n_remaining) - parseInt(new_product.n_piece);
      await productHeader.save();
    } else {
      // Find the Item
      const workOrder = await Models.WorkOrder.findOne({
        where: { workorder_ID: new_product.WorkOrder_ID },
        include: [{ model: Models.QuotationItem }],
      });

      // Create Product Header
      const reference = generateReference();
      productHeader = await Models.ProductHeader.create({
        reference,
        total_kg:
          parseFloat(new_product.n_piece) * parseFloat(new_product.piece_kg) +
          parseFloat(new_product.extra_kg) +
          parseFloat(new_product.sawdust_kg),
        n_remaining:
          workOrder.quotationItem.dataValues.unit_frequence -
          new_product.n_piece,
        n_piece: parseInt(new_product.n_piece),
        WorkOrder_ID: new_product.WorkOrder_ID,
      });
    }

    // Create the product record
    delete new_product.WorkOrder_ID;
    const productCount = await Models.Products.count({
      where: {
        ProductHeader_ID: productHeader.header_id,
      },
    });

    const product = await Models.Products.create({
      ...new_product,
      step: productCount + 1,
      total_kg:
        parseFloat(new_product.n_piece) * parseFloat(new_product.piece_kg) +
        parseFloat(new_product.extra_kg) +
        parseFloat(new_product.sawdust_kg),
      ProductHeader_ID: productHeader.header_id,
      isQC: false,
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
      });

      await old_product.save();
      res.status(200).json({ message: "Updated Record" });
    }
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let { product_id } = req.body;
    //Find the product
    const product = await Models.Products.findByPk(product_id);
    //Update the product header
    const productHeader = await Models.ProductHeader.findOne({
      where: { header_id: product.ProductHeader_ID },
    });
    productHeader.n_piece =
      parseInt(productHeader.n_piece) - parseInt(product.n_piece);
    productHeader.total_kg =
      parseFloat(productHeader.total_kg) -
      (parseFloat(product.n_piece) * parseFloat(product.piece_kg) +
        parseFloat(product.extra_kg) +
        parseFloat(product.sawdust_kg));
    productHeader.n_remaining =
      parseInt(productHeader.n_remaining) + parseInt(product.n_piece);
    await productHeader.save();

    //Delete record
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export const getProductByid = async (req, res) => {
  try {
    const { product_id } = req.body;
    //Find the product
    const product = await Models.Products.findByPk(product_id);
    res.status(200).send(product);
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export const finishProduct = async (req, res) => {
  try {
    const { workorder_ID } = req.body;
    await Models.WorkOrder.update(
      {
        isProduct: false,
        status: "completed",
      },
      {
        where: {
          workorder_ID,
        },
      }
    );

    await Models.ProductHeader.update(
      { isFinished: true },
      {
        where: {
          WorkOrder_ID: workorder_ID,
        },
      }
    );

    res.status(200).json({ message: "Production Finished" });
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export default {
  getFiltered,
  finishProduct,
  getPage,
  getProduct,
  createProduct,
  updateProduct,
  getProductByid,
  deleteProduct,
};
