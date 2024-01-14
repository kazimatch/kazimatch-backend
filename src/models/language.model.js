import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

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
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'languages',
});

Language.belongsTo(User, {
    foreignKey: 'id',
    as: 'applicant'
})