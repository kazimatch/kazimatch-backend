import { database } from "../config/index.js";
import { DataTypes } from "sequelize";



export const Skill = database.sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'skills',
});