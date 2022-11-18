import db from "../config/database.js";
import Sequelize  from "sequelize";

const CustomerAdress = db.define(
    "customer_adress",
    {
        id : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            allowNull : false,
            primaryKey : true
        },

        customer_Address : {
            type : Sequelize.STRING,
            defaultValue : "",
            allowNull : true,
        },

        //building id
        customer_bID : {
            type : Sequelize.INTEGER,
            allowNull : false
        },

        customer_bName : {
            type : Sequelize.STRING,
            allowNull : false
        },

        //Door ID
        customer_dID : {
            type : Sequelize.INTEGER,
            allowNull : false,
        },

        customer_town : {
            type : Sequelize.STRING,
            allowNull : false,
        },

        customer_district : {
            type : Sequelize.STRING,
            allowNull : false,

        },

        customer_city : {
            type : Sequelize.STRING,
            allowNull : false
        },

        customer_country : {
            type : Sequelize.STRING,
            allowNull : false
        },

        customer_UAVT : {
            type : Sequelize.INTEGER, 
            allowNull : false,
        },

        customer_postal : {
            type  : Sequelize.INTEGER,
            allowNull : false,
        },
    },

    {
        indexes : [{unique : true, fields : ["customer_UAVT", "customer_postal"]}],
        timestamps : false,
        tablename : "customer_adresses"
    }
);


export default CustomerAdress;