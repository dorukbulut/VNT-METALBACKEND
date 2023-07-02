import db from "../config/database.js";
import Sequelize from "sequelize";

const Shipments = db.define("shipment", {
    shipment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    step: {
        type: Sequelize.INTEGER,
    },
    n_piece: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    total_kg: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
    },
});

export default Shipments;
