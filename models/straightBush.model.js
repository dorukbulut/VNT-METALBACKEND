import db from "../config/database.js"
import Sequelize  from "sequelize"

const straightBush = db.define(
    "straight_bush",
    {
        large_diameter : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        inner_diameter : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        bush_length : {
            type : Sequelize.DECIMAL,
            allowNull : false
        }

        
    },
    {
       
        timestamps : false,
        
    }
);

export default straightBush