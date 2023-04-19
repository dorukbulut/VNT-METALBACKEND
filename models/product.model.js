import db from "../config/database.js";
import Sequelize from "sequelize";

const Products = db.define("products", {
  product_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  step: {
    type: Sequelize.INTEGER,
  },
  model_dims: {
    type: Sequelize.STRING,
  },
  n_piece: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
  },
  total_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0,
  },

  sawdust_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0,
  },

  piece_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0,
  },

  extra_kg: {
    type: Sequelize.DECIMAL,
    defaultValue: 0,
  },

  isQC: {
    type: Sequelize.BOOLEAN,
  },

  tin: {
    type: Sequelize.BOOLEAN,
  },
  mangan: {
    type: Sequelize.BOOLEAN,
  },
  iron: {
    type: Sequelize.BOOLEAN,
  },
  zinc: {
    type: Sequelize.BOOLEAN,
  },
  other: {
    type: Sequelize.BOOLEAN,
  },

  atelier: {
    type: Sequelize.STRING,
  },
  temperature: {
    type: Sequelize.DECIMAL,
  },

  kwa_start: {
    type: Sequelize.DECIMAL,
  },

  charge_number: {
    type: Sequelize.DECIMAL,
  },

  kwa_stop: {
    type: Sequelize.DECIMAL,
  },

  loading_start: {
    type: Sequelize.STRING,
  },

  loading_stop: {
    type: Sequelize.STRING,
  },
  casting_start: {
    type: Sequelize.STRING,
  },

  casting_stop: {
    type: Sequelize.STRING,
  },

  stop_time: {
    type: Sequelize.STRING,
  },

  stop_description: {
    type: Sequelize.STRING,
  },

  preparedBy: {
    type: Sequelize.STRING,
  },
});

export default Products;
