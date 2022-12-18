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
        lmeCopper : {
            type : Sequelize.DECIMAL,
            
        },
        lmeTin : {
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
        model_firm : {
            type : Sequelize.STRING,
            
        },

        benefitPercent : {
            type : Sequelize.STRING,
        },

        description : {
            type : Sequelize.STRING,
            
        },

        type : {
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
        kgPrice : {
            type : Sequelize.DECIMAL,
        }


    },
    {
        timestamps : false,
    }
);

export default QuotationItems;