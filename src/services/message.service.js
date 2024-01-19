import { Message, Thread } from "../models/index.js";
import { Op } from "sequelize";
export class MessageService {
    constructor() {
        this.thread = Thread;
        this.message = Message;
    }

    async getUserThreads(userId) {
        const threads = await this.thread.findAll({
            where: {
                [Op.or]: [{ partyA: userId }, { partyB: userId }]
            }
        });

        return threads.map((thread) => thread.dataValues);
    }

    async getThread(threadId) {
        return (await this.thread.findOne({
            where: {
                id: threadId
            }
        }))?.dataValues;
    }

    async getThreadMessages(threadId) {
        const messages = await this.message.findAll({
            where: {
                threadId
            }
        });

        return messages.map((message) => message.dataValues);
    }

    async addMessage(body) {
        const thread = await this.thread.findOne({
            where: {
                [Op.or]: [
                    { partyA: body.from, partyB: body.to },
                    { partyA: body.to, partyB: body.from }
                ]
            }
        });

        if (!thread) {
            const newThread = await this.thread.create({
                partyA: body.from,
                partyB: body.to,
                lastMessage: body.content,
                lastMessageDate: new Date()
            });

            body.threadId = newThread.dataValues.id;
        } else {
            body.threadId = thread.dataValues.id;
        }

        return (await this.message.create(body)).dataValues;
    }

    async deleteMessage(userId, id) {
        return (await this.message.destroy({
            where: {
                id,
                from: userId
            }
        })) > 0;
    }

    async deleteThread(userId, id) {
        return (await this.thread.destroy({
            where: {
                id,
                [Op.or]: [{ partyA: userId }, { partyB: userId }]
            }
        })) > 0;
    }
}