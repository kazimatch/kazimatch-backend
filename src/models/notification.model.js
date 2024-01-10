import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Notification = database.sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        values: ['delivered', 'pending', 'failed'],
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'notifications'
});