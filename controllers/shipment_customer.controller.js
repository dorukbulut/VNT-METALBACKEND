import Models from "../models/index.js";
import Sequelize, { Model, Op } from "sequelize";
import { generateReference } from "../utils/generateReference.js";
import Package from "../models/package.model.js";
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
                isShipmentFinished : false,
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
            include : [{model : Models.WorkOrder}]
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

        res.status(200).json({ateliers, onlyProducts, productHeader});
    }

    catch (e) {
        console.log(e)
        res.status(500).json({ message: "An Error Occured !" });
    }
}

export const getShipments = async (req, res) => {
    try {
        const { workorder } = req.body;
        const productHeader = await Models.ProductHeader.findOne({
            where: {
                WorkOrder_ID: workorder,
            },
            include : [{model : Models.WorkOrder}]
        });
        const shipments = await Models.Shipments.findAndCountAll({
            order: [["step", "ASC"]],
            where: {
                ProductHeader_ID: productHeader.header_id,
            },
            include : [{model : Models.Package, attributes : ["reference"]}],
            distinct: true,
        });


        res.status(200).json({shipments});
    }

    catch (e) {
        console.log(e)
        res.status(500).json({ message: "An Error Occured !" });
    }
}

export const searchPackage = async (req, res) => {
    try {
        let { reference } =  req.body
        const packages = await Models.Package.findAll({
            where : {
                reference: {
                    [Op.like]: `%${reference}%`,

                },
                WorkOrder_ID: {
                    [Op.is]: null,
                },
            },
            limit : 100,
            order: [["updatedAt", "DESC"]],
            attributes : ["reference", "package_id"],
        })

        res.status(200).json(packages);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "An Error Occured !" });
    }
}


export const createShipment = async (req, res) => {
    try {
        const values = {...req.body}

        const productHeader = await Models.ProductHeader.findOne({
            where : {
                WorkOrder_ID : values.WorkOrder_ID,
            }
        });

        const packageR = await Models.Package.findOne({
            where : {
                reference : values.packageReference,
            }
        });
        await packageR.update({
            WorkOrder_ID : values.WorkOrder_ID,
        })

        await packageR.save();

        const productCount = await Models.Shipments.count({
            where: {
                ProductHeader_ID: productHeader.header_id,
            },
        });

        const retval = await Models.Shipments.create({
            step : productCount + 1,
            n_piece : values.n_piece,
            total_kg : values.total_kg,
            ProductHeader_ID: productHeader.header_id,
            Product_ID : values.productId,
            Package_ID : packageR.package_id,

        });

        res.status(200).json({ message: "item created" });
    }

    catch (e) {
        console.log(e)
        res.status(500).json({ message: "An Error Occured !" });
    }
}

export const deleteShipment =  async (req, res) => {
    try {
        const { shipment_id } = req.body;

        const shipment = await Models.Shipments.findByPk(shipment_id);

        const packageR = await Models.Package.findByPk(shipment.Package_ID)

        await packageR.update({
            WorkOrder_ID : null,
        })

        await packageR.save()
        await shipment.destroy()
        await shipment.save()

        res.status(200).json({ message: "Shipment Deleted" });

    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: "An Error Occured !" });
    }
}


export const finishShipment = async (req, res) => {
    try {
        const { workorder_ID } = req.body;
        await Models.ProductHeader.update(
            { isShipmentFinished: true },
            {
                where: {
                    WorkOrder_ID: workorder_ID,
                },
            }
        );

        res.status(200).json({ message: "Shipment Finished" });
    } catch (err) {
        console.error(err);
        res.status(405).json({ message: "Server Error" });
    }
};

export default {finishShipment,getFiltered ,getPage, getAllItems, searchPackage, createShipment, getShipments, deleteShipment}
