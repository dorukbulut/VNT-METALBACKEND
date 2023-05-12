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
          atelier: {[Op.or] : ["İç Atölye", "Dış Atölye"]},
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
      const allProducts = await Models.Products.findAndCountAll({
        where: {
          ProductHeader_ID: productHeader.header_id,
          atelier: {[Op.or] : ["İç Atölye", "Dış Atölye"]},
        },
        attributes: [
          "n_piece",
        ],
        distinct: true,
      });
      const sum = allProducts.rows.reduce((prev, curr) => prev + parseInt(curr.dataValues.n_piece), 0)

      const analyze = workOrder.quotationItem.analyze.dataValues.analyze_Name;
      const WorkOrderReference =
        workOrder.reference + "-REV-" + workOrder.revision.toString();
      const customer = workOrder.dataValues.Customer_ID;

      res.status(200).send({
        productHeader,
        analyze,
        customer,
        products,
        sum,
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

export const getAtelier = async (req, res) => {
  try {
    const { workorder } = req.body;
    const pageNumber   = req.params.page;
    const productHeader = await Models.ProductHeader.findOne({
      where: {
        WorkOrder_ID: workorder,
      },
    });
    const ateliers = await Models.Process.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
      order: [["step", "ASC"]],
      where: {
        ProductHeader_ID: productHeader.header_id,
      },
      include : [{model : Models.Products, attributes : ["step"]}],
      attributes: [
        "step",
        "Product_ID",
        "atelier_id",
        "n_piece",
        "total_kg",
        "atelier_dims",
        "isQC",
        "atelier_id",
        "preparedBy",
      ],
      distinct: true,
    });

    res.status(200).send({ateliers});
  }catch (e) {
    console.log(e);
    res.status(405).json({message : "Server Error"});
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
    let atelier = { ...req.body };


    // Find the atelier record
    const old_atelier = await Models.Process.findByPk(atelier.atelier_id);
    //Update the record
    await old_atelier.update({
      ...atelier.values,
      isQC: "pending",
    });

    await old_atelier.save();
    res.status(200).json({ message: "Updated Record" });




  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export const getAtelierid = async (req, res) => {
  try {
    const { atelier_id } = req.body;
    //Find the product
    const product = await Models.Process.findByPk(atelier_id);
    res.status(200).send(product);
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};


export const returnMaxItem = async (req, res) => {
  try{
    const { product_id } = req.body;
    const product = await Models.Products.findByPk(product_id);
    const atelier = await Models.Process.findAndCountAll({
      where : {
        Product_ID : product_id,
      }
    });

    if (atelier) {
      const sum = atelier.rows.reduce((prev, curr) => prev + parseInt(curr.dataValues.n_piece), 0)

      res.status(200).send({
        max_item : product.n_piece - sum
      })

    } else {
      res.status(200).send({
        max_item : product.n_piece,
      })
    }
  }
  catch (e) {
    console.log(e);
    res.status(405).json({message : "Server Error"});
  }
}

export const finishAtelier = async (req, res) => {
  try {
    const { workorder_ID } = req.body;
    await Models.ProductHeader.update(
        { isAtelierFinished: true },
        {
          where: {
            WorkOrder_ID: workorder_ID,
          },
        }
    );

    res.status(200).json({ message: "Atelier Finished" });
  } catch (err) {
    console.error(err);
    res.status(405).json({ message: "Server Error" });
  }
};

export default {
  getPage,
  getFiltered,
  getProduct,
  getAtelier,
  createProduct,
  updateProduct,
  getAtelierid,
  returnMaxItem,
  finishAtelier,
};
