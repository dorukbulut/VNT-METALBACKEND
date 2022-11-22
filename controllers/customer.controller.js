import Customer from "../models/customer.model.js";
import TaxInfo from "../models/taxinfo.model.js";
import CustomerAdress from "../models/customerAdress.model.js";



//DONE
export const createCustomer = async (req, res) => {
    
    try{
        
        const newCustomer = {...req.body};
        const ncus = await Customer.create(newCustomer.customer)
        const newTax = await TaxInfo.create({
            ...newCustomer.taxinfo,
            Customer_ID : newCustomer.customer.account_id
        })
        const newAdd = await CustomerAdress.create({
            ...newCustomer.adressinfo,
            Customer_ID : newCustomer.customer.account_id
        })

        res.status(200).json({message : "Customer created."});
    }

    catch(err) {
        res.status(500).json({message: "An error occured."});
    }
     
}

//Done
export const updateCustomer = async(req, res) => {
    const customer = {...req.body};
    try {

        if(Customer.findOne({where : {account_id : customer.account_id}})) {
            let retval = await Customer.update(customer.customer, {where : {account_id : customer.account_id }});
            retval = await TaxInfo.update(customer.taxinfo, {where : {Customer_ID : customer.account_id}});
            retval = await CustomerAdress.update(customer.adressinfo, {where : {Customer_ID: customer.account_id}});
            res.status(200).json({message : "Customer updated"});
        } else {
            res.status(401).json({message : "Cannot find customer"});
        }

        
    }
    catch(err) {
        res.status(500).json({message : "An error occurred."})
    }
}

//Done
export const getCustomer = async(req, res) => {
    const q = {...req.body};

    try {
        const customer = await Customer.findAll({where : {
            account_id : q.account_id,
        }, include : [TaxInfo, CustomerAdress]});
    
        if (customer.length !==0 ) {
            res.status(200).json({customer});
        } else {
            res.status(401).json({message : "Cannot find any user"});
        }
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message: "An error occured"});
    }
   
}


//Done
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({include : [TaxInfo, CustomerAdress]});
        if(customers !==0) {
            res.status(200).json({customers})
        } else {
            res.status(401).json({message : "No Customer found in database"});
        }
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message: "An error occured"});
    }
}

// Done
export const deleteCustomer = async (req, res) => {
    const cus = {...req.body}
    try {
        const row = await Customer.findOne({where : {account_id : cus.account_id }})
        if(row) {
            let retval = await Customer.destroy({
                where : {
                    account_id : cus.account_id
                },
    
                force:true,
            });
    
           
            
             retval = await TaxInfo.destroy({
                where : {
                    Customer_ID : cus.account_id
                },
    
                force : true
            });
    
            retval = await CustomerAdress.destroy({
                where : {
                    Customer_ID : cus.account_id
                },
    
                force : true
            });
            
            res.status(200).json({message : "Customer Deleted."});
        } else {
            res.status(401).json({message: "Cannot find customer !"});
        }
        
    }   
   

    catch (err) {
        console.log(err);
        res.send(500).json({message : "An error ocurred"});
    }
}

export default {createCustomer, updateCustomer, getCustomer, getAllCustomers, deleteCustomer};