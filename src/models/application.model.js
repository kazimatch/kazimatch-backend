import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User, Job } from "./index.js";

export const Application = database.sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    applicant: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    job: {
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
        allowNull: true
    },
    coverLetter: {
        type: DataTypes.UUID,
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