import Models from "../models/index.js";
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
                { model: Models.WorkOrder, include: [{ model: Models.SaleConfirmation, include : [{model : Models.QuotationForm, attributes : ["reference", "revision"]}], attributes:["reference", "revision"] }], attributes : ["reference", "revision", "Customer_ID"] },
            ],
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
            include: [
                { model: Models.WorkOrder, include: [{ model: Models.SaleConfirmation, include : [{model : Models.QuotationForm, attributes : ["reference", "revision"]}], attributes:["reference", "revision"] }], attributes : ["reference", "revision", "Customer_ID"] },
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
        res.redirect("/api/report-production/get-page/0");
    }
};




export default {getPage, getFiltered}
