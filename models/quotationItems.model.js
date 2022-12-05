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
        },
        unit_price : {
            type : Sequelize.DECIMAL,
            
        },
        model_price : {
            type : Sequelize.DECIMAL,
            
        },
        treatment_price : {
            type : Sequelize.DECIMAL,
            
        },
        test_price : {
            type : Sequelize.DECIMAL,
            
        },
        alternativeSale_price : {
            type : Sequelize.DECIMAL,
            
        },
        deliveryTime : {
            type : Sequelize.DECIMAL,
            
        },
        treatment_firm : {
            type : Sequelize.STRING,
            
        },

        description : {
            type : Sequelize.STRING,
            
        },
        euro : {
            type : Sequelize.DECIMAL,
            
        },

        usd : {
            type : Sequelize.DECIMAL,
            
        },
        createdAt : {
            type : Sequelize.DATE,
            
        },


    },
    {
        timestamps : false,
    }
);

export default QuotationItems;