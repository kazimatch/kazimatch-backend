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
    type: {
        type: DataTypes.STRING,
        values: ['email', 'notification', "feedback"],
        allowNull: false,
        defaultValue: 'notification'
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    action: {
        type: DataTypes.STRING,
        values: ['account', 'message', 'feedback'],
        defaultValue: 'account',
        allowNull: false
    }
}, {
    tableName: 'notifications'
});

Notification.belongsTo(User, {
    foreignKey: 'id',
    as: 'user'
})