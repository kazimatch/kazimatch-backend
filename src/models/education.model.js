import { database } from "../config/index.js";
import { DataTypes } from "sequelize";

export const Education = database.sequelize.define('Education', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        values: ['university', 'college', 'high-school', 'middle-school', 'elementary-school'],
        allowNull: false
    },
    school: {
        type: DataTypes.STRING,
        allowNull: false
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'educations',
});