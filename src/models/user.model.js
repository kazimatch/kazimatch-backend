import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const User = database.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        values: ['admin', 'user'],
        allowNull: false,
        defaultValue: 'user'
    },
    organizations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    groups: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    authProvider: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    paranoid: true,
});