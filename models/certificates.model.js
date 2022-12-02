import db from "../config/database.js";
import Sequelize  from "sequelize";


const Certificates = db.define(
    "certificates",
    {
        certificates_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },

        name : {
            type : Sequelize.STRING,
            allowNull : false,
        }


    },

    {
        

        timestamps : false,
       
    }
); 


export default Certificates;