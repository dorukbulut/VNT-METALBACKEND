import Models from "../models/index.js";
import axios from "axios";
import Sequelize, { Op } from "sequelize";

// TODO : Solve the problem between reference number and Actual form number.

//
export const createForm = async (req, res) => {
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
            reference: `ORN-${
              new_confirmation.options.Customer_ID
            }-${new Date().getFullYear()}-${
              serialCount.length !== 0
                ? parseInt(serialCount[0].dataValues.Count) + 1
                : 1
            }`,
          });
        
        res.status(200).json({message : "Sale confirmation Created !"});
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

export const generateForm = async (req, res) => {}

export const deleteForm = async (req, res) => {}

export const getForms = async (req ,res) => {}

export const getAll = async (req, res) => {}


export default {createForm, updateForm, generateForm, deleteForm, getForms, getAll}