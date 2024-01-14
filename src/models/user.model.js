import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { Experience, Document, Language, Education, Notification } from "./index.js";

export const User = database.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        values: ['admin', 'applicant', 'employer'],
        allowNull: false,
        defaultValue: 'applicant'
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
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    authProvider: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        values: ['male', 'female', 'non-binary'],
        allowNull: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'users',
    paranoid: true,
});

