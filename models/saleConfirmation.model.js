import db from "../config/database.js";
import Sequelize from "sequelize";

const SaleConfirmation = db.define(
  "sale_confirmation",
  {
    sale_ID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    OrderDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    deliveryDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    updatedAt: {
      type: Sequelize.DATE,
    },

    customerReference: {
      type: Sequelize.STRING,
    },
    specialOffers: {
      type: Sequelize.STRING,
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    revision: {
      type: Sequelize.INTEGER,
    },

    description: {
      type: Sequelize.STRING,
    },

    year: {
      type: Sequelize.BIGINT,
    },

    month: {
      type: Sequelize.BIGINT,
    },

    day: {
      type: Sequelize.BIGINT,
    },

    package: {
      type: Sequelize.BOOLEAN,
    },

    company: {
      type: Sequelize.STRING,
    },

    language: {
      type: Sequelize.STRING,
    },
  },

  {
    timestamps: false,
  }
);

export default SaleConfirmation;
