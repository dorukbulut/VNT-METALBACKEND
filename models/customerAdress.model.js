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
            
        },

        customer_bName : {
            type : Sequelize.STRING,
            
        },

        //Door ID
        customer_dID : {
            type : Sequelize.INTEGER,
            
        },

        customer_town : {
            type : Sequelize.STRING,
            
        },

        customer_district : {
            type : Sequelize.STRING,
            

        },

        customer_city : {
            type : Sequelize.STRING,
            
        },

        customer_country : {
            type : Sequelize.STRING,
            
        },

        customer_UAVT : {
            type : Sequelize.INTEGER, 
            
        },

        customer_postal : {
            type  : Sequelize.INTEGER,
            
        },
    },

    {
        timestamps : false,
        tablename : "customer_adresses"
    }
);


export default CustomerAdress;