import db from "../config/database.js";
import Sequelize from "sequelize";

const ProductHeader = db.define("productheader", {
  header_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  reference: {
    type: Sequelize.STRING,
  },
  n_piece: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },

  n_remaining: {
    type: Sequelize.DECIMAL,
  },

  total_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0,
  },
});

export default ProductHeader;
