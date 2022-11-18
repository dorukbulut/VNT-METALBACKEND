import db from "../config/database.js";
import Sequelize  from "sequelize";


const TaxInfo = db.define(
    "tax_info",
    {
        tax_info_taxID : {
            type : Sequelize.BIGINT,
            primaryKey : true,
            allowNull : false,
        },

        tax_info_Admin : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },

        tax_info_AdminID : {
            type : Sequelize.INTEGER,
            allowNull : false
        },

    },

    {
        indexes : [{unique : true, fields : ["tax_info_taxID", "tax_info_AdminID"]}],
        timestamps : false,
        tablename : "CustomersTaxInfo"
    }
); 


export default TaxInfo;