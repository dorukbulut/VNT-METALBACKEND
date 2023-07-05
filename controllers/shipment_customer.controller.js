import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import { generateReference } from "../utils/generateReference.js";
function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}

export const getPage = async (req, res) => {
    const pageNumber = req.params.page;
    try {
        const forms = await Models.ProductHeader.findAndCountAll({
            limit: 6,
            offset: pageNumber * 6,
            order: [["updatedAt", "DESC"]],
            include: [
                { model: Models.WorkOrder, include: [{ model: Models.QuotationItem }] },
            ],
            where: {
                isAtelierFinished: true,
                isFinished: true,
            },
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
            where: { ...queryParams, isAtelierFinished: true, isFinished : true},
            order: [["updatedAt", "DESC"]],
            include: [
                { model: Models.WorkOrder, include: [{ model: Models.QuotationItem }] },
            ],
        };
        try {
            const customers = await Models.ProductHeader.findAndCountAll(condition);
            res.status(200).json(customers);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An Error Occured !" });
        }
    } else {
        res.redirect("/api/shipment-customer/get-page/0");
    }
};

export const getAllItems = async (req, res) => {
    try {
        const { workorder } = req.body;
        const productHeader = await Models.ProductHeader.findOne({
            where: {
                WorkOrder_ID: workorder,
            },
        });
        const onlyProducts = await Models.Products.findAndCountAll({

            order: [["step", "ASC"]],
            where: {
                ProductHeader_ID: productHeader.header_id,
                atelier : "Yok"
            },
            distinct: true,
        });

        const ateliers = await Models.Process.findAndCountAll({
            order: [["step", "ASC"]],
            where: {
                ProductHeader_ID: productHeader.header_id,

            },
            include : [{model : Models.Products}],
            distinct: true,
        })

        res.status(200).json({ateliers, onlyProducts});
    }

    catch (e) {
        console.log(e)
        res.status(500).json({ message: "An Error Occured !" });
    }
}

export default {getFiltered ,getPage, getAllItems}
