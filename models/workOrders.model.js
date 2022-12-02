import db from "../config/database.js";
import Sequelize  from "sequelize";


const WorkOrders = db.define(
    "work_orders",
    {
        workorder_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },

        reference_Number : {
            type : Sequelize.STRING,
            allowNull : false,
        },

        finalWeight : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },
        

    },

    {
        
        indexes : [{unique : true, fields : ["reference_Number"]}],
        timestamps : false,
       
    }
); 


export default SaleConfirmation;