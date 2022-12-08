import db from "../config/database.js"
import Sequelize  from "sequelize"

const MiddleBracketBush = db.define(
    "middlebracket_bush",
    {
        bracket_q1 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_q2 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_q3 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_q4 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_l1 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_l2 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_l3 : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bracket_full : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        

        
    },
    {
       
        timestamps : false,
        
    }
);

export default MiddleBracketBush;