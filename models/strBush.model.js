import db from "../config/database.js"
import Sequelize  from "sequelize"

const strBush = db.define(
    "straight_bush",
    {
        bushId : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false
        },

        serialNo : {
            type : Sequelize.INTEGER,
            allowNull : false
        },

        bigDimemsion : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        innerDim : {
          type : Sequelize.DECIMAL,
          allowNull : false  
        },

        length : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },
        pieceNumber : {
            type : Sequelize.INTEGER,
            allowNull : false
        },

        KgPrice : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        modelPrice : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        processingPrice: {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        processingFirm : {
            type : Sequelize.STRING,
            allowNull : false
        },

        testPrice : {
            type : Sequelize.STRING,
            allowNull: false,
        },

        alternativePrice : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        euro : {
            type : Sequelize.DECIMAL, 
            allowNull : false,
        },


        usd :  {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        created_At : {
            type : Sequelize.DATE,
            allowNull : false
        }

    },
    {
        
        tablename : "straight_bush"
    }
);

export default strBush;