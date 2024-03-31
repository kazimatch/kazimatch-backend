import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Job = database.sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    type: {
      values: ["full-time", "part-time", "contract", "internship", "volunteer"],
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    file: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      values: ["accepting", "withheld", "not-accepting"],
      defaultValue: "accepting",
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      values: ["entry", "intermediate", "senior"],
      allowNull: false,
      defaultValue: "entry",
    },
    hasFeedback: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "jobs",
  }
);
