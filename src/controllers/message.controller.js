import { MessageService, UserService } from "../services/index.js";

export class MessageController {
    constructor() {
        this.messageService = new MessageService();
        this.userService = new UserService();
    }

    async getUserThreads(userId) {
        return (await this.messageService.getUserThreads(userId));
    }

    async getThreadMessages(threadId) {
        return (await this.messageService.getThreadMessages(threadId));
    }

    async addMessage(userId, body) {
        body['from'] = userId;

        const recipient = await this.userService.getById(body.to);

        // You can only send messages to activated users
        if (!recipient || !recipient.isActivated) {
            return null
        }

        const message = await this.messageService.addMessage(body);
        if (!message) return null;

        if (!recipient.isOnline) {
            // TODO!: Implement Notification Service
        }

        return message;
    }

    async deleteMessage(userId, id) {
        return (await this.messageService.deleteMessage(userId, id));
    }
}