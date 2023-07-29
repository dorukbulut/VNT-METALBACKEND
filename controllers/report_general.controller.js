import Models from "../models/index.js";
import Sequelize from "sequelize";

export const generalReport = async (req, res) => {
    try {
        const all_approved = await Models.SaleConfirmation.findAll({
            attributes: ["Quotation_ID"],
            raw: true,
            group: ["Quotation_ID"],
        })


        const values = all_approved.map((item) => item["Quotation_ID"]);

        const quot_item = await Models.QuotationForm.findAll({
            where: {
                quotation_ID: values,
            },
            attributes : ["grand_total"],
            include: [
                {
                    model: Models.QuotationItem,
                    attributes: ["item_id", "currency", "unit_frequence", "itemType"],
                },
                {
                    model : Models.DeliveryType,
                    attributes : ["total"]
                }
            ],

        })


        const all_confirmations = await Models.SaleConfirmation.count({
            where : {
                Quotation_ID : values
            }
        })

        const all_worders = await Models.WorkOrder.count()
        const all_quots = await Models.QuotationForm.count()


        const result = quot_item.map((item) => {
            const num_items = item.dataValues.quotationItems.length;

            // Convert the grand total and delivery total to numbers
            const grandTotal = parseFloat(item.dataValues.grand_total) || 0;
            const deliveryTotal = parseFloat(item.dataValues.delivery_type.dataValues.total) || 0;

            // Calculate the sum of grand total and delivery total
            const totalSum = grandTotal + deliveryTotal;

            const itemTypeCounts = {
                total : 0
            };


            return {
                num_items,
                totalSum,
                currency : item.dataValues.quotationItems[0].currency,

            };
        });

        const totalNumItems = result.reduce((total, item) => total + item.num_items, 0);
        let total_sales =  {}
        let itemTypeCounts = {
            total : 0
        };

        quot_item.forEach((item) => {
            item.dataValues.quotationItems.forEach((quotationItem) => {
                const { itemType, unit_frequence } = quotationItem.dataValues;
                if (!itemTypeCounts[itemType]) {
                    itemTypeCounts[itemType] = unit_frequence;
                } else {
                    itemTypeCounts[itemType] += unit_frequence;
                }
                itemTypeCounts["total"] += unit_frequence
            });
        });

        result.forEach((item) => {
            const { currency, totalSum } = item;
            if (!total_sales[currency]) {
                total_sales[currency] = totalSum;
            } else {
                total_sales[currency] += totalSum;
            }

        });

        const prH = await Models.ProductHeader.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_kg')), 'totalAmount'] // Using the SUM function
            ]
        });

        const proH = await Models.Products.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('extra_kg')), 'totalAmount'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'rowCount'] // Using the SUM function
            ]
        });

        const proces = await Models.Process.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_kg')), 'totalAmount'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'rowCount'] // Using the SUM function
            ]
        });

        const shp = await Models.Shipments.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_kg')), 'totalAmount'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'rowCount'] // Using the SUM function
            ]
        });


        res.status(200).send({total_sales_revisions : all_confirmations - totalNumItems,
            total_workorder_revisions : all_worders - totalNumItems,
            total_quotation_revisions : all_quots - values.length,
            total_productionorders : totalNumItems,
            total_quotations : values.length,
            itemTypeCounts,
            totalProductionKgs : prH.get("totalAmount"),
            totalProductionExtraKgs : proH.get("totalAmount"),
            totalProductionUsages : proH.get("rowCount"),
            totalProcessKgs : proces.get("totalAmount"),
            totalProcessUsages : proces.get("rowCount"),
            totalShipmentKgs : shp.get("totalAmount"),
            totalShipmentUsages : shp.get("rowCount"),
            total_sales,
            });

    }
    catch (e) {
        console.log(e)
        res.status(500).json({message : "Internal Server Error"})
    }
}



export default {generalReport}
