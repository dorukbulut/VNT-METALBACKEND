import db from "../config/database.js";
import Sequelize  from "sequelize";


const SaleConfirmation = db.define(
    "sale_confirmation",
    {
        sale_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },



    },

    {
        
       
        timestamps : false,
       
    }
); 


export default SaleConfirmation;