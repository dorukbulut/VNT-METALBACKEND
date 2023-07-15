import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import { generateReference } from "../utils/generateReference.js";



function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}


export const searchWorkOrder = async (req, res) => {
    try {
        let { reference } =  req.body
        const workorders = await Models.WorkOrder.findAll({
            where : {
                reference: {
                   [Op.like]: `%${reference}%`,
                },
            },
            limit : 100,
            order: [["revision", "DESC"]],
            attributes : ["workorder_ID","reference", "revision"],
        })

        res.status(200).json(workorders);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "An Error Occured !" });
    }
}

export const getPage = async (req, res) => {
    const pageNumber = req.params.page;
    try {
        const forms = await Models.Package.findAndCountAll({
            limit: 6,
            offset: pageNumber * 6,
            order: [["updatedAt", "DESC"]],
            distinct: true,
        });

        res.status(200).json(forms);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An Error Occured !" });
    }
};

export const getFiltered = async (req, res) => {
    const queryParams = { ...req.query };
    if (!isEmptyObject(queryParams)) {
        let condition = {
            where: { ...queryParams},
            order: [["updatedAt", "DESC"]],
        };
        try {
            const customers = await Models.Package.findAndCountAll(condition);
            res.status(200).json(customers);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An Error Occured !" });
        }
    } else {
        res.redirect("/api/shipment-packaging/get-page/0");
    }
};



export default {
    getPage,
    searchWorkOrder,
    getFiltered
}
