import db from "../config/database.js";
import Sequelize  from "sequelize";


const DeliveryType = db.define(
    "delivery_type",
    {
        delivery_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },

        name : {
            type : Sequelize.STRING,
            allowNull : false,
        },

        package_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        loading_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },
        delivery_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        export_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        terminal_fee_exit : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },
        vehicleLoading_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        transport_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        insurance_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        terminal_fee_entry : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        import_fee : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },


    },

    {
        
        timestamps : false,
       
    }
); 


export default DeliveryType;