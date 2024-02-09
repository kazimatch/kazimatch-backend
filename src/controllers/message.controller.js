import { MessageService, UserService, QueueService } from "../services/index.js";

export class MessageController {
    constructor() {
        this.messageService = new MessageService();
        this.userService = new UserService();
    }

    async getUserThreads(userId) {
        return (await this.messageService.getUserThreads(userId));
    }

    async getThreadMessages(to, from) {
        const thread = await this.messageService.getThread(to, from);
        if (!thread) return null;

        return (await this.messageService.getThreadMessages(to, from));
    }

    async addMessage(userId, body) {

        body['from'] = userId;

        const recipient = await this.userService.getById(body.to);

        // You can only send messages to activated users
        // if (!recipient || !recipient.isActivated) {
        //     return null
        // }

        const message = await this.messageService.addMessage(body);
        if (!message) return null;

        if (!recipient.isOnline && recipient.pushToken) {
            const user = await this.userService.getById(userId);

            QueueService.queue('notification', {
                tokens: [recipient.pushToken],
                title: `${user.fullName}`,
                body: `${body.content}`
            });
        }
        
        return message;
    }

    async deleteMessage(userId, id) {
        return (await this.messageService.deleteMessage(userId, id));
    }

    async deleteThread(threadId, userId) {
        return (await this.messageService.deleteThread(userId, threadId));
    }

}