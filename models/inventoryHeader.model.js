import db from "../config/database.js";
import Sequelize from "sequelize";

const InventoryHeader = db.define("inventory_header", {
    header_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    reference: {
        type: Sequelize.STRING,
    },
    inventoryType : {
        type : Sequelize.STRING
    },
    inventoryName : {
        type : Sequelize.STRING
    },
    n_remaining: {
        type: Sequelize.DECIMAL,
    },
});

export default InventoryHeader;

