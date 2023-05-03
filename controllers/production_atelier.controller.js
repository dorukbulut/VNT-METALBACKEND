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
      where: { ...queryParams },
      order: [["updatedAt", "DESC"]],
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

export default {
  getPage,
  getFiltered,
};
