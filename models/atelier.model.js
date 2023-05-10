import db from "../config/database.js";
import Sequelize from "sequelize";

const Process = db.define("process", {
    atelier_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    step: {
        type: Sequelize.INTEGER,
    },
    atelier_dims: {
        type: Sequelize.STRING,
    },
    n_piece: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    preparedBy: {
        type: Sequelize.STRING,
    },
    isQC: {
        type: Sequelize.STRING,
    },
    total_kg: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
    },
});

export default Process;
