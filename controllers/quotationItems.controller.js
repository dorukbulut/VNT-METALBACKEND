import Models from "../models/index.js";
import { Op } from "sequelize";

const createQuotationItem = async (Model, new_item) => {
  return await Models.QuotationItem.create(
    {
      ...new_item.options,
      createdAt: new Date().toLocaleDateString('fr-CA'),
    },
    {
      include: [
        {
          association: Model,
        },
      ],
    }
  );
};

const updateQuotationItem = async (Model, new_item, Model2) => {
  let reti = await Models.QuotationItem.update(
    {
      ...new_item.options,
    },
    {
      where: {
        item_id: new_item.item_id,
      },
    }
  );

  return await Model2.update(
    {
      ...new_item.type_options,
    },
    {
      where: {
        Item_ID: new_item.item_id,
      },
    }
  );
};

//DONE
export const createItem = async (req, res) => {
  const new_item = { ...req.body };
  try {
    switch (new_item.type) {
      case "straight_bush":
        const retval = await createQuotationItem(
          Models.QuotationItem.StraigthBush,
          new_item
        );
        res.status(200).json({ message: "Straight Bush Created !" });
        break;
      case "bracket_bush":
        const retval2 = await createQuotationItem(
          Models.QuotationItem.BracketBush,
          new_item
        );
        res.status(200).json({ message: "Bracket Bush Created !" });
        break;
      case "plate_strip":
        const retval3 = await createQuotationItem(
          Models.QuotationItem.PlateStrip,
          new_item
        );
        res.status(200).json({ message: " Plate/Strip Created !" });
        break;
      case "double_bracket_bush" :
        const retval4 = await createQuotationItem(
          Models.QuotationItem.DoubleBracketBush,
          new_item
        );
        res.status(200).json({ message: "Double Bracket created !" });
        break;
      case "middle_bracket_bush" : 
        const retval5 = await createQuotationItem(
          Models.QuotationItem.MiddleBracketBush,
          new_item
        );
        res.status(200).json({ message: "Middle Bracket created !" });
        break;
    }
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
        isUsed : false
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
      where : {
        isUsed : false,
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
    switch (new_item.type) {
      case "straight_bush":
        const retval = await updateQuotationItem(
          Models.QuotationItem.StraigthBush,
          new_item,
          Models.StraigthBush
        );
        res.status(200).json({ message: "Straight Bush Updated !" });
        break;
      case "bracket_bush":
        const retval2 = await updateQuotationItem(
          Models.QuotationItem.BracketBush,
          new_item,
          Models.BracketBush
        );
        res.status(200).json({ message: "Bracket Bush Updated !" });
        break;
      case "plate_strip":
        const retval3 = await updateQuotationItem(
          Models.QuotationItem.PlateStrip,
          new_item,
          Models.PlateStrip
        );
        res.status(200).json({ message: " Plate/Strip Updated !" });
        break;
      
      case  "double_bracket_bush":
        const retval4 = await updateQuotationItem(
          Models.QuotationItem.DoubleBracketBush,
          new_item,
          Models.DoubleBracketBush
        );
        res.status(200).json({ message: "Double Bracket Bush Updated !" });
        break;
      
      case  "middle_bracket_bush":
        const retval5 = await updateQuotationItem(
          Models.QuotationItem.MiddleBracketBush,
          new_item,
          Models.MiddleBracketBush
        );
        res.status(200).json({ message: "Middle Bracket Bush Updated !" });
        break;
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "An error occured." });
  }
};

//DONE
export const deleteItem = async (req, res) => {
  const item = { ...req.body };

  try {
    switch (item.type) {
      case "straight_bush":
        const cos = await Models.StraigthBush.destroy({
          where: {
            Item_ID: item.item_id,
          },
          force: true,
        });
        const retval = await Models.QuotationItem.destroy({
          where: {
            item_id: item.item_id,
          },
          force: true,
        });

        res.status(200).json({ message: "deleted !" });
        break;
      case "bracket_bush":
        const cos2 = await Models.BracketBush.destroy({
          where: {
            Item_ID: item.item_id,
          },
        });

        const retval2 = await Models.QuotationItem.destroy({
          where: {
            item_id: item.item_id,
          },
          force: true,
        });
        res.status(200).json({ message: "deleted !" });
        break;
      case "plate_strip":
        const cos3 = await Models.PlateStrip.destroy({
          where: {
            Item_ID: item.item_id,
          },
        });

        const retval3 = await Models.QuotationItem.destroy({
          where: {
            item_id: item.item_id,
          },
          force: true,
        });
        res.status(200).json({ message: "deleted !" });
        break;
        case "double_bracket_bush":
          const cos4 = await Models.DoubleBracketBush.destroy({
            where: {
              Item_ID: item.item_id,
            },
          });
  
          const retval4 = await Models.QuotationItem.destroy({
            where: {
              item_id: item.item_id,
            },
            force: true,
          });
          res.status(200).json({ message: "deleted !" });
          break;
        
        case "middle_bracket_bush":
        const cos5 = await Models.MiddleBracketBush.destroy({
          where: {
            Item_ID: item.item_id,
          },
        });

        const retval5 = await Models.QuotationItem.destroy({
          where: {
            item_id: item.item_id,
          },
          force: true,
        });
        res.status(200).json({ message: "deleted !" });
        break;
      
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const setQuotation = async (req, res) => {
  const items = { ...req.body };
  try {
    let reti = await Models.QuotationItem.bulkCreate(
      items.all,
      {
        updateOnDuplicate :["Quotation_ID", "deliveryTime", "description", "isUsed"]
      }
    );
    res.status(200).json({ message: "quotation is set for items."});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured." });
  }
};

export const getPage = async(req, res) => {
  const pageNumber = req.params.page
  try {
    const items = await Models.QuotationItem.findAndCountAll({
      limit : 6,
      offset : pageNumber * 6,
      where : {
        isUsed : false
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
    
    
    res.status(200).json(items);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({message : "An Error Occured !"});
  }
}

function isEmptyObject(obj){
  return JSON.stringify(obj) === '{}'
}
export const getFiltered = async (req, res) => {
  const queryParams = {...req.query}
  if(!isEmptyObject(queryParams)) {
    let condition  = {
      where : {
        isUsed : false
      },
      include: [
        Models.StraigthBush,
        Models.BracketBush,
        Models.PlateStrip,
        Models.DoubleBracketBush,
        Models.MiddleBracketBush,
        Models.Analyze,
      ],
    }
    if (queryParams.account) {
      condition.where.Customer_ID = queryParams.account
    }

    if (queryParams.date) {

      condition.where.createdAt = queryParams.date
    }
    
    
    
    try {
      const customers = await Models.QuotationItem.findAndCountAll(condition);
      if(queryParams.type) {
        let new_customers = []
        if (queryParams.rows.type.includes("FlanşlıBurç")) {
          new_customers = customers.rows.map(customer => {
            if(customer.bracket_bush !== null) {
              return customer
            }
          })
        }
  
        if (queryParams.type.includes("ÇiftFlanşlıBurç")) {
          new_customers = customers.rows.map(customer => {
            if(customer.doublebracket_bush !== null) {
              return customer
            }
          })
        }
  
        if (queryParams.type.includes("OrtadanFlanşlıBurç")) {
          new_customers = customers.rows.map(customer => {
            if(customer.middlebracket_bush !== null) {
              return customer
            }
          })
        }
  
        if (queryParams.type.includes("DüzBurç")) {
          new_customers = customers.rows.map(customer => {
            if(customer.straight_bush !== null) {
              return customer
            }
          })
        }
  
        if (queryParams.type.includes("Plaka")) {
          new_customers = customers.rows.map(customer => {
            if(customer.plate_strip !== null) {
              return customer
            }
          })
        }
      new_customers.count = customers.count
      res.status(200).json(new_customers);
      }
      res.status(200).json(customers);
    }
  
    catch(err) {
      console.log(err);
      res.status(500).json({message : "An Error Occured !"});
    }
  } else {
    res.sendStatus(401);
  }
}

export default {getPage, getFiltered, createItem, getItems, getAll, updateItem, deleteItem, setQuotation, getByQuotation };
