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

        finalWeight : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },
        

    },

    {
        timestamps : false,
       
    }
); 


export default WorkOrders;