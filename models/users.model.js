import db from "../config/database.js";
import Sequelize  from "sequelize";

const User = db.define('Users', {
    id: {
        type : Sequelize.UUID,
        primaryKey : true,
        allowNull : false,
        defaultValue : Sequelize.UUIDV4
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    roles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
    },
    modules: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
    },
});

export default User;
