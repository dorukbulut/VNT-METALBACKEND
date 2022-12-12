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
        },
        
        reference : {
            type : Sequelize.STRING,
            allowNull : false
        },

        revision : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        plate_model_size : {
            type : Sequelize.STRING,

        },
        treatment_size : {
            type :Sequelize.STRING
        },
        year : {
            type : Sequelize.INTEGER
        },
        month : {
            type : Sequelize.INTEGER
        },
        day : {
            type : Sequelize.INTEGER
        }
    },

    {
        timestamps : false,
       
    }
); 


export default WorkOrders;