import db from "../config/database.js";
import Sequelize from "sequelize";

const Package = db.define("packages", {
    package_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    reference: {
        type: Sequelize.STRING,
    },
});

export default Package;
