import db from "../config/database.js";
import Sequelize  from "sequelize";


const RefIds = db.define(
    "RefIds",
    {
        reference_Number : {
            type : Sequelize.STRING,
            allowNull : false,
            primaryKey : true
        },

        count : {
            type : Sequelize.INTEGER,
            allowNull : false,
        }


    },

    {
        timestamps : false,
       
    }
); 


export default RefIds;