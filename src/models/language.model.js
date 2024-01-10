import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Language = database.sequelize.define('Language', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        values: ['beginner', 'intermediate', 'advanced', 'native'],
        allowNull: false
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'languages',
});