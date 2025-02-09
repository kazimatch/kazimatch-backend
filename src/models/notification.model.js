import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Notification = database.sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient: {
        type: DataTypes.UUID,
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
        values: ['account', 'message', 'feedback', 'referral'],
        defaultValue: 'account',
        allowNull: false
    },
    resourceType: {
        type: DataTypes.ENUM('user', 'job', 'application', 'thread', 'message', 'feedback', 'referral'),
        allowNull: true
    },
    resourceId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'notifications'
});

Notification.belongsTo(User, {
    foreignKey: 'id',
    as: 'user'
})