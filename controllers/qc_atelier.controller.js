import Models from "../models/index.js";

function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}

export const getPage = async (req, res) => {
    const pageNumber = req.params.page;
    try {
        const data = await Models.Process.findAndCountAll({
            limit: 6,
            offset: pageNumber * 6,
            attributes : ["atelier_id", "step", "isQC", "createdAt"],
            order: [["updatedAt", "DESC"]],
            include : [{model : Models.ProductHeader, attributes : ["reference"]}, {model : Models.Products, attributes : ["step"]}],
            distinct: true,
        });

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An Error Occured !" });
    }
};

export const getFiltered = async (req, res) => {
    const queryParams = { ...req.query };
    if (!isEmptyObject(queryParams)) {
        try {
            const productHeader = await Models.ProductHeader.findOne({
                where : {
                    "reference" : queryParams.reference
                }
            });
            if(productHeader) {
                let condition = {
                    include : [{model : Models.ProductHeader, attributes : ["reference"]}, {model : Models.Products, attributes : ["step"]}],
                    where : {
                        ProductHeader_ID : productHeader.header_id,
                    },
                    attributes : ["atelier_id", "step", "isQC", "createdAt"],
                    order: [
                        ["updatedAt", "DESC"],
                    ],
                };
                const customers = await Models.Process.findAndCountAll(condition);
                res.status(200).json(customers);
            }

            else {
                res.status(200).json({
                    "count": 0,
                    "rows": []
                })
            }


        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An Error Occured !" });
        }
    } else {
        res.redirect("/api/qc-atelier/get-page/0");
    }
};


export const setQC = async (req, res) => {
    try {
        const {atelier_id, qcValue} = req.body
        const product = await Models.Process.findByPk(atelier_id);

        await product.update({
            isQC : qcValue,
        })

        res.status(200).json({"message" : "Changed QC !"})
    }
    catch (e) {
        res.status(500).json({"message" : "Server Error"})
    }
}
export default {
    setQC,
    getFiltered,
    getPage
}
