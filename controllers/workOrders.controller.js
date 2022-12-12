import Models from "../models/index.js";
import Sequelize, {Op}  from "sequelize";
import QuotationForm from "../models/quotationForm.model.js";

const create = async (new_order) =>  {
    const serialCount =  await Models.WorkOrder.findAll({
        group: ["Customer_ID", "reference"],
        attributes: [
          "Customer_ID",
          "reference",
          [Sequelize.fn("count", Sequelize.col("workorder_ID")), "Count"],
        ],
        where: {
          year: parseInt(new Date().getFullYear()),
          Customer_ID: new_order.options.Customer_ID

        },
        distinct : true,
      });
    
      const newCreated = await Models.WorkOrder.create({
        ...new_order.options,
        year: parseInt(new Date().getFullYear()),
        day: parseInt(new Date().getDate()),
        month: parseInt(new Date().getMonth() + 1),
        revision : 0, 
        reference: `WORN-${
          new_order.options.Customer_ID
        }-${new Date().getFullYear()}-${
          serialCount.length !== 0
            ? parseInt(serialCount.length) + 1
            : 1
        }`,
      });
}

const update = async (order) => {
    const serialCount = await Models.WorkOrder.findAll({
        group: ["reference"],
        attributes: [
          "reference",
          [Sequelize.fn("count", Sequelize.col("reference")), "Count"],
        ],
        where: {
          reference: order.options.reference,
        },
      });
      
      const newCreated = await Models.WorkOrder.create({
        ...order.options,
        year: parseInt(new Date().getFullYear()),
        day: parseInt(new Date().getDate()),
        month: parseInt(new Date().getMonth() + 1),
        revision : serialCount[0].dataValues.Count
        
      });
}


//DONE
export const createWorkOrder = async (req ,res) => {
    const new_order = {...req.body};
    try {
        await create(new_order);
        res.status(200).json({message : "New Work Order Created !"});
        }
       catch (err) {
        console.log(err);
    
        res.status(500).json({ message: "An error occured." });
      }
}

//DONE
export const updateWorkOrder = async (req ,res) => {
    const order = {...req.body};
    try {
        await update(order)
        res.status(200).json({message : "Work Order Updated !"});
        }
       catch (err) {
        console.log(err);
    
        res.status(500).json({ message: "An error occured." });
      }
}

//DONE
export const getWorkOrder = async (req ,res) => {
    const items = { ...req.body };

  try {
    const retval = await Models.WorkOrder.findAll({
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
        model : Models.SaleConfirmation,
        include : [{
            model : Models.QuotationForm,
            include : [Models.DeliveryType]
        }, Models.Certificate]
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

// DONE
export const getAllWorkOrder = async(req ,res) => {
  try {
    const retval = await Models.WorkOrder.findAll({
      include: [
       {
        model : Models.QuotationItem,
        include : [Models.Analyze, Models.BracketBush, Models.StraigthBush, Models.PlateStrip, Models.DoubleBracketBush, Models.MiddleBracketBush]
       },
       {
        model : Models.SaleConfirmation,
        include : [{
            model : Models.QuotationForm,
            include : [Models.DeliveryType]
        }, Models.Certificate]
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

//TODO
export const generateWorkOrder = (req ,res) => {}

//DONE
export const deleteWorkOrder = async (req ,res) => {
    const item = {...req.body}

  try {
   
    const retval2 = await Models.WorkOrder.destroy({
      where : {
        workorder_ID : item.workorder_ID
      },

      force : true
    });

    res.status(200).json({message : "Work Order Deleted !"});
  }

  catch(err) {
    console.log(err);
    res.status(500).json({message : "An error occured !"});
  }
}



export default {createWorkOrder, updateWorkOrder, getWorkOrder, getAllWorkOrder, generateWorkOrder, deleteWorkOrder}