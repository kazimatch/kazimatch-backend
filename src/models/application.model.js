import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User, Job } from "./index.js";

export const Application = database.sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    applicant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    job: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Job,
            key: 'id'
        }
    },
    status: {
        values: ['pending', 'accepted', 'hired', 'rejected'],
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    resume: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    coverLetter: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'applications',
});