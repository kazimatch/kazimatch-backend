import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./index.js";

export const Thread = database.sequelize.define('Thread', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    partyA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    partyB: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    lastMessage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastMessageDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'threads',
});