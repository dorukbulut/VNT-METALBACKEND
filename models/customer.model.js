import db from "../config/database.js";
import Sequelize  from "sequelize";

const Customer = db.define(
    "customer",
    {
        account_id : {
            type : Sequelize.INTEGER,
            allowNull : false,
            primaryKey : true
        },

        account_title : {
            type : Sequelize.STRING,
            allowNull : false
        },

        account_related : {
            type : Sequelize.STRING,
            allowNull : false,

        },

        account_IN : {
            type : Sequelize.BIGINT,
            allowNull : false
        },

        account_tel1 : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },
        account_tel2 : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },

        account_fax  : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true
        },

        account_email : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },

        account_webSite : {
            type : Sequelize.STRING,
            allowNull : true
        },

        account_KEP : {
            type : Sequelize.STRING,
            allowNull : false
        }

    },
    {
        indexes : [{unique : true, fields : ["account_id", "account_IN", "account_KEP"]}],
        timestamps : false,
        tablename : "Customers"
    }
)


export default Customer;