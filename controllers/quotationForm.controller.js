import Models from "../models/index.js";
import axios from "axios";
import Sequelize  from "sequelize";
import GenerateQuotation from "../utils/generateQuotation.js";


//TODO Generate Form Templates
export const createForm = async (req, res) => {
    const new_form = {...req.body};
    
    try {
        const serialCount =  await Models.QuotationForm.findAll({
            group: ['Customer_ID'],
            attributes: ['Customer_ID',[Sequelize.fn('count', Sequelize.col('quotation_ID')), "Count"]],
            where : {
                year : parseInt(new Date().getFullYear()),
                Customer_ID : new_form.options.Customer_ID
            }
        });
        
        const newDelivery = await Models.DeliveryType.create({
            ...new_form.delivery_type
        })

        
        const newCreated = await Models.QuotationForm.create({
            ...new_form.options,
            day : parseInt(new Date().getDate()),
            month : parseInt(new Date().getMonth() + 1),
            year : parseInt(new Date().getFullYear()),
            reference : `T-${new_form.options.Customer_ID}-${new Date().getFullYear()}-${serialCount.length !==0 ? parseInt(serialCount[0].dataValues.Count) + 1 : 1}`,
            Delivery_ID : newDelivery.delivery_ID
          },
          )
        
        const new_arr = new_form.all.map(item => {
            return {
                ...item,
                Quotation_ID : newCreated.quotation_ID
            }
        })
        const resl = await axios({
            method : "POST",
            url : "http://localhost:3001/api/quotation-items/set-quotation",
            data : {
                all : new_arr
            }
        })
        
        if(resl.status === 200)  {
            GenerateQuotation();
            res.status(200).json({message : "ok"});
        }
        else {
            res.status(500).json({message : "An error occured !"});
        }
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message : "An error occured !"});
    }
};


//Todo
export const getForms = (req, res) => {};


//Todo
export const getAllForms = (req, res) => {};

//Todo
export const updateForms = (req, res) => {};
//Todo
export const deleteForms = (req, res) => {};
//Todo
export const generate = (req, res) => {};

export default {
  createForm,
  getForms,
  getAllForms,
  updateForms,
  deleteForms,
  generate,
};
