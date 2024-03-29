import Models from "../models/index.js";
import { Op } from "sequelize";
import db from "../config/database.js";
import { modelMap } from "../utils/mappers.js";
import { isEmptyObject } from "../utils/isEmptyObject.js";

const createQuotationItem = async (Model, new_item, t) => {
  return await Models.QuotationItem.create(
    {
      ...new_item.options,
      createdAt: new Date(),
    },
    {
      include: [
        {
          association: Model,
        },
      ],
    },
    { transaction: t }
  );
};

const updateQuotationItem = async (Model, new_item, type_ops, t) => {
  let reti = await Models.QuotationItem.update(
    {
      ...new_item.options,
      createdAt: new Date(),
    },
    {
      where: {
        item_id: new_item.item_id,
      },
    },
    { transaction: t }
  );

  return await Model.upsert({
    ...type_ops,
    Item_ID: new_item.item_id,
  });
};

//DONE
export const createItem = async (req, res) => {
  const new_item = { ...req.body };
  try {
    const result = await db.transaction(async (t) => {
      const retval = await createQuotationItem(
        modelMap[new_item.options.itemType],
        new_item,
        t
      );
      res.status(200).json({ message: "Createa Item" });
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const getItems = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.QuotationItem.findAll({
      where: {
        [Op.or]: {
          Customer_ID: items.Customer_ID,
        },
        isUsed: false,
      },
      order: [["createdAt", "DESC"]],
      include: [
        Models.StraigthBush,
        Models.BracketBush,
        Models.PlateStrip,
        Models.DoubleBracketBush,
        Models.MiddleBracketBush,
        Models.Analyze,
      ],
    });

    // retval.sort(function (a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.createdAt) - new Date(a.createdAt);
    // });

    console.log();

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const getByItemID = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.QuotationItem.findAll({
      where: {
        [Op.or]: {
          item_id: items.item_id,
        },
      },
      include: [
        Models.StraigthBush,
        Models.BracketBush,
        Models.PlateStrip,
        Models.DoubleBracketBush,
        Models.MiddleBracketBush,
        Models.Analyze,
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const getByQuotAndID = async (req, res) => {
  const items = { ...req.body };

  try {
    const retval = await Models.QuotationItem.findAll({
      where: {
        [Op.or]: [
          { Quotation_ID: items.item_id },
          { Customer_ID: items.Customer_ID, isUsed: false },
        ],
      },
      order: [["createdAt", "DESC"]],
      include: [Models.Analyze],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const getByQuotation = async (req, res) => {
  const items = { ...req.body };
  try {
    const retval = await Models.QuotationItem.findAll({
      where: {
        [Op.or]: {
          Quotation_ID: items.Quotation_ID,
        },
      },
      include: [
        Models.StraigthBush,
        Models.BracketBush,
        Models.PlateStrip,
        Models.DoubleBracketBush,
        Models.MiddleBracketBush,
        Models.Analyze,
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
    const retval = await Models.QuotationItem.findAll({
      where: {
        isUsed: false,
      },
      include: [
        Models.StraigthBush,
        Models.BracketBush,
        Models.PlateStrip,
        Models.DoubleBracketBush,
        Models.MiddleBracketBush,
        Models.Analyze,
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const updateItem = async (req, res) => {
  const new_item = { ...req.body };
  try {
    const result = await db.transaction(async (t) => {
      await Models.QuotationItem.destroy(
        {
          where: {
            item_id: new_item.item_id,
          },
          include: [
            {
              association: modelMap[new_item.oldType],
            },
          ],
          force: true,
        },

        { transaction: t }
      );

      const retval = await createQuotationItem(
        modelMap[new_item.options.itemType],
        new_item,
        t
      );

      res.status(200).json({ message: "Update Item" });
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "An error occured." });
  }
};

export const setQuotation = async (req, res) => {
  const items = { ...req.body };
  try {
    const tranres = db.transaction(async (t) => {
      items.all.map(async (item) => {
        let row = await Models.QuotationItem.findOne({
          where: {
            item_id: item.item_id,
          },
          include: [
            Models.StraigthBush,
            Models.BracketBush,
            Models.PlateStrip,
            Models.DoubleBracketBush,
            Models.MiddleBracketBush,
          ],
        });
        if (row.dataValues.isUsed) {
          let map = row.dataValues.itemType;
          delete row.dataValues.item_id;
          delete item.item_id;
          delete row.dataValues[map].dataValues.id;
          const data = {
            options: {
              ...row.dataValues,
              ...item,
            },
          };

          const results = await createQuotationItem(
            modelMap[`${data.options.itemType}`],
            data,
            t
          );
        } else {
          let new_data = [];
          new_data.push(item);

          if (new_data.length !== 0) {
            let reti = await Models.QuotationItem.bulkCreate(new_data, {
              updateOnDuplicate: [
                "Quotation_ID",
                "deliveryTime",
                "description",
                "isUsed",
              ],
            });
          }
        }
      });

      res.status(200).json({ message: "quotation is set for items." });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const getPage = async (req, res) => {
  const pageNumber = req.params.page;
  try {
    const items = await Models.QuotationItem.findAndCountAll({
      limit: 6,
      offset: pageNumber * 6,
    });

    res.status(200).json(items);
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
    };

    try {
      const customers = await Models.QuotationItem.findAndCountAll(condition);
      res.status(200).json(customers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An Error Occured !" });
    }
  } else {
    res.redirect("/api/quotation-items/get-page/0");
  }
};

export default {
  getPage,
  getFiltered,
  createItem,
  getItems,
  getAll,
  getByItemID,
  getByQuotAndID,
  updateItem,
  setQuotation,
  getByQuotation,
};
