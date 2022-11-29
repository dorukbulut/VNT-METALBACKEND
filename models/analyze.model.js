import db from "../config/database.js"
import Sequelize  from "sequelize"

const Analyze = db.define(
    "analyze",
    {
        analyze_id : {
            type : Sequelize.UUID,
            primaryKey : true,
            allowNull : false
        },
        analyze_Name : {
            type : Sequelize.STRING,
            allowNull : false
        },

        anaylyze_coef : {
            type : Sequelize.DECIMAL,
            allowNull : false
        },

        
    },
    {
        indexes : [{unique : true, fields : ["analyze_Name"]}],
        timestamps : false,
        tablename : "AnalyzeInfo"
    }
);

export default Analyze