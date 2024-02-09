import { database } from "../config/index.js";
import { DataTypes } from "sequelize";
import { Thread, User } from "./index.js";

export const Message = database.sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    media: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    threadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Thread,
            key: 'id'
        }
    }
}, {
    tableName: 'messages',
});