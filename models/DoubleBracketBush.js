
import db from "../config/database.js"
import Sequelize  from "sequelize"

const DoubleBracketBush = db.define(
    "doublebracket_bush",
    {
        bigger_diameter : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        body_diameter : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        inner_diameter : {
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

export default DoubleBracketBush;
