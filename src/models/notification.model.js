import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

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
    recipient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
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

Notification.belongsTo(User, {
    foreignKey: 'id',
    as: 'user'
})