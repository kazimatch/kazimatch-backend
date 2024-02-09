import { Message, Thread, User } from "../models/index.js";
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
            },
            include: [
                {
                    model: this.message,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    as: "messages"
                },
                {
                    model: User,
                    as: 'sender',
                },
                {
                    model: User,
                    as: 'receiver',
                }
            ]
        });

        return threads.map((thread) => thread.dataValues);
    }

    async getThread(to, from) {
        return (await this.thread.findOne({
            where: {
                [Op.or]: [
                    { partyA: to, partyB: from },
                    { partyA: from, partyB: to }
                ]
            }
        }))?.dataValues;
    }

    async getThreadMessages(to, from) {
        const messages = await this.message.findAll({
            where: {

                [Op.or]: [
                    { to: to, from: from },
                    { to: from, from: to }
                ]
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