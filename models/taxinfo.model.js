import db from "../config/database.js";
import Sequelize  from "sequelize";


const TaxInfo = db.define(
    "tax_info",
    {
        tax_info_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },


        tax_info_Admin : {
            type : Sequelize.STRING, 
            allowNull : true,
        },

        tax_info_AdminID : {
            type : Sequelize.INTEGER,
            allowNull : false
        },

        tax_info_taxID : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
    },

    {
        indexes : [{unique : true, fields : ["tax_info_AdminID", "tax_info_taxID"]}],
        timestamps : false,
        tablename : "CustomersTaxInfo"
    }
); 


export default TaxInfo;