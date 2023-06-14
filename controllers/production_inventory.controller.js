import Models from "../models/index.js";

export function generateReference() {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const randomChars = generateRandomString(4);
    const randomDigits = generateRandomDigits(4);
    return `STU${month}${day}${randomChars}${randomDigits}`;
}

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomDigits(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
}



export const setInventory  = async (req , res) => {
    try {
        const { newInventory } = req.body ;
        const retval = await Models.InventoryHeader.create({...newInventory, reference : generateReference()});
        res.status(200).json({message : "New Inventory created"});
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "An error occured." });
    }
}

export const getPage = async (req, res) => {
    const pageNumber = req.params.page;
    try {
        const forms = await Models.InventoryHeader.findAndCountAll({
            limit: 6,
            offset: pageNumber * 6,
            attributes : ["header_id","reference", "inventoryType", "inventoryName", "n_remaining", "updatedAt"],
            order: [
                ["updatedAt", "DESC"],
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
            attributes : ["header_id","reference", "inventoryType", "inventoryName", "n_remaining", "updatedAt"],
            order: [
                ["updatedAt", "DESC"],
            ],
            distinct: true,
        };
        try {
            const customers = await Models.InventoryHeader.findAndCountAll(condition);
            res.status(200).json(customers);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An Error Occured !" });
        }
    } else {
        res.redirect("/api/production-inventory/get-page/0");
    }
};


export default {
    setInventory,
    getPage,
    getFiltered
}
