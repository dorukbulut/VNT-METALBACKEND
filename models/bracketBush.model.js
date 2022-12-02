import db from "../config/database.js"
import Sequelize  from "sequelize"

const bracketBush = db.define(
    "bracket_bush",
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

        bracket_length : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bush_length : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        
    },
    {
       
        timestamps : false,
        
    }
);

export default bracketBush