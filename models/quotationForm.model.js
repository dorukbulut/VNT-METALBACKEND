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

        day : {
            type : Sequelize.INTEGER,
            
        },

        month : {
            type : Sequelize.INTEGER,
            
        },

        year : {
            type : Sequelize.INTEGER,
            
        },

        customerInquiryNum : {
            type : Sequelize.STRING,
           
        },

        grand_total : {
            type : Sequelize.DECIMAL,
            
        },

        validityOfOffer : {
            type : Sequelize.STRING,
            
        },
        IncotermType : {
            type : Sequelize.STRING,
            
        },
        PaymentTerms : {
            type : Sequelize.STRING,
            
        },

        extraDetails : {
            type : Sequelize.STRING,
           
        },

        preparedBy : {
            type : Sequelize.STRING,
            
        },

        approvedBy : {
            type : Sequelize.STRING,
            
        },

        reference : {
            type : Sequelize.STRING,
            
        },

        revision : {
            type : Sequelize.INTEGER,
            
        }


    },

    {
        
        timestamps : false,
       
    }
); 


export default QuotationForm;