import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Document = database.sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'documents',
});