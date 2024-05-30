import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { User } from "./index.js";

export const Thread = database.sequelize.define('Thread', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    partyA: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    partyB: {
        type: DataTypes.UUID,
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