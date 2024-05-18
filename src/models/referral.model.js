import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Referral = database.sequelize.define('Referral', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    from: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    to: {
        type: DataTypes.INTEGER,
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