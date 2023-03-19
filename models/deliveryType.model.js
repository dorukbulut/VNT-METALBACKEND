import db from "../config/database.js";
import Sequelize from "sequelize";

const DeliveryType = db.define(
  "delivery_type",
  {
    delivery_ID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    area: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    package_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    loading_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },
    delivery_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    export_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    terminal_fee_exit: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },
    vehicleLoading_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    transport_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    insurance_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    terminal_fee_entry: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    import_fee: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },

    currencyType: {
      type: Sequelize.STRING,
    },
    currencyVal: {
      type: Sequelize.DECIMAL,
    },
    total: {
      type: Sequelize.BIGINT,
    },
    description: {
      type: Sequelize.STRING,
    },
  },

  {
    timestamps: false,
  }
);

export default DeliveryType;
