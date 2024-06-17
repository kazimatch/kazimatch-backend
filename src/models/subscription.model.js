import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { Plan } from "./plan.model.js";

export const Subscription = database.sequelize.define('Subscription', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    applicantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    planId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Plan,
            key: 'id'
        }
    },
    requestId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'subscriptions',
});