import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Document = database.sequelize.define('Document', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('CV', 'CL', 'OTHER'),
        allowNull: false,
        defaultValue: 'OTHER'
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'documents',
});

