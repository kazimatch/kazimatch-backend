import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Experience = database.sequelize.define('Experience', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'experiences',
});