import db from "../config/database.js";
import Sequelize  from "sequelize";


const TaxInfo = db.define(
    "tax_info",
    {
        id : {
            type : Sequelize.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4
        },

        tax_info_taxID : {
            type : Sequelize.BIGINT,
            
        },

        tax_info_Admin : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },

        tax_info_AdminID : {
            type : Sequelize.INTEGER,
            
        },

    },

    {
        timestamps : false,
        tablename : "CustomersTaxInfo"
    }
); 


export default TaxInfo;