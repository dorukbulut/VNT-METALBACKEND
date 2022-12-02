import db from "../config/database.js";
import Sequelize  from "sequelize";


const QuotationForm = db.define(
    "quotation_forms",
    {
        quotation_ID : {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
        },

        createdAt : {
            type : Sequelize.DATEONLY,
            allowNull : false,
        },

        customerInquiryNum : {
            type : Sequelize.STRING,
            allowNull : false
        },

        grand_total : {
            type : Sequelize.DECIMAL,
            allowNull : false,
        },

        validityOfOffer : {
            type : Sequelize.STRING,
            allowNull : false
        },
        IncotermType : {
            type : Sequelize.STRING,
            allowNull : false
        },
        PaymentTerms : {
            type : Sequelize.STRING,
            allowNull : false
        },

        extraDetails : {
            type : Sequelize.STRING,
            allowNull : false
        },

        preparedBy : {
            type : Sequelize.STRING,
            allowNull : false
        },

        approvedBy : {
            type : Sequelize.STRING,
            allowNull : false
        },

        reference_Number : {
            type : Sequelize.STRING,
            allowNull : false,
        }


    },

    {
        indexes : [{unique : true, fields : ["reference_Number"]}],
        timestamps : false,
       
    }
); 


export default QuotationForm;