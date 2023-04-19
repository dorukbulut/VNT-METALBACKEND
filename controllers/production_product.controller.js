import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";

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

  try {
    const retval = await Models.ProductHeader.findOne({
      where: {
        WorkOrder_ID: workorder,
      },
      include: [
        {
          model: Models.Products,
        },
      ],
    });
    if (retval) {
      const products = await Models.Products.findAndCountAll();
      //where -> Product Header id
      res.status(200).send(retval);
    } else {
      res.status(200).send([]);
    }
  } catch (err) {
    console.log(err);
    res.status(405).send({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  let new_product = { ...req.body };
};

export const updateProduct = async (req, res) => {
  let product = { ...req.body };
};

export const deleteProduct = async (req, res) => {
  let product = { ...req.body };
};

export default {
  getFiltered,
  getPage,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
