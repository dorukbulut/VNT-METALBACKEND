import Models from "../models/index.js";
import axios from "axios";
import Sequelize, { Op } from "sequelize";



//DONE
export const createForm = async (req, res) => {
    const new_confirmation = {...req.body}
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
            distinct : true,
          });
        
          const newCreated = await Models.SaleConfirmation.create({
            ...new_confirmation.options,
            year: parseInt(new Date().getFullYear()),
            day: parseInt(new Date().getDate()),
            month: parseInt(new Date().getMonth() + 1),
            reference: `ORN-${
              new_confirmation.options.Customer_ID
            }-${new Date().getFullYear()}-${
              serialCount.length !== 0
                ? parseInt(serialCount.length) + 1
                : 1
            }`,
          });
        res.status(200).json({message : "Sale Confirmation Created !"});
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message : "An error occured !"})
    }
}
//DONE
export const updateForm = async (req, res) => {
    const new_confirmation = {...req.body}
    try {
        const serialCount = await Models.SaleConfirmation.findAll({
            group: ["Customer_ID"],
            attributes: [
              "Customer_ID",
              [Sequelize.fn("count", Sequelize.col("sale_ID")), "Count"],
            ],
            where: {
              year: parseInt(new Date().getFullYear()),
              Customer_ID: new_confirmation.options.Customer_ID,

            },
          });
          const newCreated = await Models.SaleConfirmation.create({
            ...new_confirmation.options,
            year: parseInt(new Date().getFullYear()),
            day: parseInt(new Date().getDate()),
            month: parseInt(new Date().getMonth() + 1),
          });
        
        res.status(200).json({message : "NewSale confirmation Created !"});
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message : "An error occured !"})
    }
}

//TODO
export const generateForm = async (req, res) => {}

//DONE
export const deleteForm = async (req, res) => {
  const item = {...req.body}

  try {
    const retval1 = await Models.WorkOrder.update({
      Sale_ID : null
    },
    {
      where : {
        Sale_ID : item.Sale_ID
      }
    });

    const retval2 = await Models.SaleConfirmation.destroy({
      where : {
        sale_ID : item.Sale_ID
      },

      force : true
    });

    res.status(200).json({message : "Sale Confirmation Deleted !"});
  }

  catch(err) {
    console.log(err);
    res.status(500).json({message : "An error occured !"});
  }
}

//DONE
export const getForms = async (req ,res) => {
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
        model : Models.QuotationItem,
        include : [Models.Analyze, Models.BracketBush, Models.StraigthBush, Models.PlateStrip, Models.DoubleBracketBush, Models.MiddleBracketBush]
       },
       {
        model : Models.QuotationForm,
        include : [Models.DeliveryType]
       },

       {
        
        model : Models.Certificate
       },
       {
        model : Models.Customer,
       }
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
}

//DONE
export const getAll = async (req, res) => {

  try {
    const retval = await Models.SaleConfirmation.findAll({
      include: [
       {
        model : Models.QuotationItem,
        include : [Models.Analyze, Models.BracketBush, Models.StraigthBush, Models.PlateStrip, Models.DoubleBracketBush, Models.MiddleBracketBush]
       },
       {
        model : Models.QuotationForm,
        include : [Models.DeliveryType]
       },

       {
        
        model : Models.Certificate
       },
       {
        model : Models.Customer,
       }
      ],
    });

    res.status(200).json(retval);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
}


export default {createForm, updateForm, generateForm, deleteForm, getForms, getAll}