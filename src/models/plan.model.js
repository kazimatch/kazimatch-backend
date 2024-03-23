import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Plan = database.sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cycle: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: false,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "plans",
  }
);
