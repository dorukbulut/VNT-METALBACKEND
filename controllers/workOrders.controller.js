import Models from "../models/index.js";
import Sequelize, {Model, Op}  from "sequelize";
import QuotationForm from "../models/quotationForm.model.js";
import GenerateWorkOrder from "../utils/generateWorkOrder.js";

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
export const generateWorkOrder = async (req ,res) => {
  const item = {...req.body}
  try {
    switch (item.type) {
      //DONE
      case  "straigth_bush" :

        const retval = await Models.WorkOrder.findOne({
          where : {
            workorder_ID : item.id
          },
          include: [
            {
             model : Models.QuotationItem,
             include : [Models.Analyze, Models.StraigthBush]
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
        })
        let A8 = parseFloat(retval.dataValues.quotationItem.straight_bush.large_diameter)
        let B8 = parseFloat(retval.dataValues.quotationItem.straight_bush.inner_diameter)
        let C8 = parseFloat(retval.dataValues.quotationItem.straight_bush.bush_length)
        let calc = ((A8/2)*(A8/2)*3.14*C8*8.6-(B8/2)*(B8/2)*3.14*C8*8.6)/1000000
        
        const new_form = {
          "reference" : retval.dataValues.reference,
          "qty" : retval.dataValues.quotationItem.unit_frequence,
          "deliveryDate" : retval.dataValues.sale_confirmation.deliveryDate,
          "analysis" : retval.dataValues.quotationItem.analyze.analyze_Name,
          "customer_reference" : retval.dataValues.sale_confirmation.customerReference,
          "description" : retval.dataValues.sale_confirmation.description,
          "specials" : retval.dataValues.sale_confirmation.specialOffers,
          "date" : `${retval.dataValues.day}-${retval.dataValues.month}-${retval.dataValues.year}`,
          "big_dia" : retval.dataValues.quotationItem.straight_bush.large_diameter,
          "inner" : retval.dataValues.quotationItem.straight_bush.inner_diameter,
          "length" : retval.dataValues.quotationItem.straight_bush.bush_length,
          "calc_weigth" : calc,
          "treament_firm" : retval.dataValues.quotationItem.treatment_firm,
          "model_firm" :  retval.dataValues.quotationItem.model_firm,
          "packaging" : retval.dataValues.sale_confirmation.package,
          "hasPackage" : retval.dataValues.sale_confirmation.package,
          "certificates" : retval.dataValues.sale_confirmation.certificates.map(item => {
            return {
                "certificate" : item.name
            }
          }),
          "revision" : retval.dataValues.revision
        }
        const buf = await GenerateWorkOrder(new_form,"straightbush_template.docx");
        let options = {
            root : "./files"
        }
        res.status(200).sendFile("output3.docx", options);
        
        
        break;
      //DONE
      case "bracket_bush":
        const retval1 = await Models.WorkOrder.findOne({
          where : {
            workorder_ID : item.id
          },
          include: [
            {
             model : Models.QuotationItem,
             include : [Models.Analyze, Models.BracketBush]
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
        })
        const new_form1 = {
          "reference" : retval1.dataValues.reference,
          "qty" : retval1.dataValues.quotationItem.unit_frequence,
          "deliveryDate" : retval1.dataValues.sale_confirmation.deliveryDate,
          "analysis" : retval1.dataValues.quotationItem.analyze.analyze_Name,
          "customer_reference" : retval1.dataValues.sale_confirmation.customerReference,
          "description" : retval1.dataValues.sale_confirmation.description,
          "specials" : retval1.dataValues.sale_confirmation.specialOffers,
          "date" : `${retval1.dataValues.day}-${retval1.dataValues.month}-${retval1.dataValues.year}`,
          "Q1" :  retval1.dataValues.quotationItem.bracket_bush.bigger_diameter,
          "Q2" : retval1.dataValues.quotationItem.bracket_bush.inner_diameter ,
          "Q3" : retval1.dataValues.quotationItem.bracket_bush.body_diameter ,
          "L1" : retval1.dataValues.quotationItem.bracket_bush.bracket_length,
          "L" :   retval1.dataValues.quotationItem.bracket_bush.bush_length,
          "calc_weigth" : 0,
          "treament_firm" : retval1.dataValues.quotationItem.treatment_firm,
          "model_firm" :  retval1.dataValues.quotationItem.model_firm,
          "packaging" : retval1.dataValues.sale_confirmation.package,
          "hasPackage" : retval1.dataValues.sale_confirmation.package,
          "certificates" : retval1.dataValues.sale_confirmation.certificates.map(item => {
            return {
                "certificate" : item.name
            }
          }),
          "revision" : retval1.dataValues.revision
        }
        const buf1 = await GenerateWorkOrder(new_form1,"bracket_bush_template.docx");
        let options1 = {
            root : "./files"
        }
        res.status(200).sendFile("output3.docx", options1);
        break;
      case "plate_strip" :
        const retval2 = await Models.WorkOrder.findOne({
          where : {
            workorder_ID : item.id
          },
          include: [
            {
             model : Models.QuotationItem,
             include : [Models.Analyze, Models.PlateStrip]
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
        })

        res.status(200).json(retval2);
        break;
      
      case "middlebracket_bush":
        const retval3 = await Models.WorkOrder.findOne({
          where : {
            workorder_ID : item.id
          },
          include: [
            {
             model : Models.QuotationItem,
             include : [Models.Analyze, Models.MiddleBracketBush]
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
        })

        res.status(200).json(retval3);
        break;
      
      case "doublebracket_bush":
        const retval4 = await Models.WorkOrder.findOne({
          where : {
            workorder_ID : item.id
          },
          include: [
            {
             model : Models.QuotationItem,
             include : [Models.Analyze, Models.DoubleBracketBush]
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
        })

        res.status(200).json(retval4);
        break;
    }
  }
  catch(err) {
    console.log(err);
    res.status(500).json({message  :"An error occured !"})
  }
}

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