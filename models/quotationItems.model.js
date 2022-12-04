import db from "../config/database.js"
import Sequelize  from "sequelize"

const QuotationItems = db.define(
    "quotationItems",
    {
        item_id : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            allowNull : false,
            primaryKey : true,
        },
        unit_frequence : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        unit_price : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        model_price : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        treatment_price : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        test_price : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        alternativeSale_price : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        deliveryTime : {
            type : Sequelize.DECIMAL,
            
        },
        treatment_firm : {
            type : Sequelize.STRING,
            allowNull : false
        },

        description : {
            type : Sequelize.STRING,
            
        },
        euro : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        usd : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        createdAt : {
            type : Sequelize.DATE,
            allowNull : false
        },


    },
    {
        timestamps : false,
    }
);

export default QuotationItems;