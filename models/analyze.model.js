import db from "../config/database.js"
import Sequelize  from "sequelize"

const Analyze = db.define(
    "analyze",
    {
        analyze_id : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false
        },
        analyze_Name : {
            type : Sequelize.STRING,
            allowNull : false
        },

        analyze_coef : {
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