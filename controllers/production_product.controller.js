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
      where : {
          'status' : 'pending'
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
      where: { ...queryParams, 'status' : "pending" },
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

export default {
    getFiltered,
    getPage

}
