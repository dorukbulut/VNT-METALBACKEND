import db from "../config/database.js"
import Sequelize  from "sequelize"

const plateStrip = db.define(
    "plate_strip",
    {
        width: {
            type : Sequelize.DECIMAL,
            allowNull : false
        },
        length : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        thickness : {
            type : Sequelize.DECIMAL,
            allowNull : false
        }

        
    },
    {
       
        timestamps : false,
        
    }
);

export default plateStrip