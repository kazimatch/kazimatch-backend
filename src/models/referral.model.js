import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Referral = database.sequelize.define('Referral', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    from: {
        type: DataTypes.UUID,
        allowNull: false
    },
    to: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'referrals',
})