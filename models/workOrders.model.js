import db from "../config/database.js";
import Sequelize from "sequelize";

const WorkOrders = db.define(
  "work_orders",
  {
    workorder_ID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    finalWeight: {
      type: Sequelize.DECIMAL,
    },

    reference: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },

    revision: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    plate_model_size: {
      type: Sequelize.STRING,
    },
    treatment_size: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
    },
    year: {
      type: Sequelize.INTEGER,
    },
    month: {
      type: Sequelize.INTEGER,
    },
    day: {
      type: Sequelize.INTEGER,
    },
    company: {
      type: Sequelize.STRING,
    },
    isProduct: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },

  {
    timestamps: false,
  }
);

export default WorkOrders;
