import { Server, Socket } from 'socket.io';
import { MessageController, UserController } from '../controllers/index.js';
import chalk from 'chalk';
import { verifyToken } from '../utils/crypt.js';

export class RealtimeService {
    /**
     * 
     * @param {Server} io 
     */
    constructor(io) {
        this.io = io;
        this.messageController = new MessageController(io);
        this.userController = new UserController(io);

        this.io.on('connection', (socket) => {
            this.messages(socket);
            this.user(socket);
        });
    }

    /**
     * 
     * @param {Socket} socket 
     */
    messages(socket) {
        socket.on('message', async (data) => {
            try {
                const decoded = verifyToken(data.token);
                if (!decoded) return;

                const message = await this.messageController.addMessage(decoded.id, data);
                if (!message) return;

                this.io.emit(`message-${message.threadId}`, message);
            } catch (err) {
                console.log(chalk.red(err));
            }
        });

        socket.on('delete-message', async (data) => {
            try {
                const decoded = verifyToken(data.token);
                if (!decoded) return;

                const message = await this.messageController.deleteMessage(decoded.id, data.id);
                if (!message) return;

                this.io.emit(`delete-message-${data.threadId}`, message);
            } catch (err) {
                console.log(chalk.red(err));
            }
        });
    }

    /**
     * 
     * @param {Socket} socket 
     */
    user(socket) {
        socket.on('connect', async (data) => {
            try {
                const decoded = verifyToken(data.token);
                if (!decoded) return;

                const res = await this.userController.updateUser(decoded.id, { isOnline: true });
                if (!res) return;

                this.io.emit(`user-${data.userId}`, res);
            } catch (err) { }
        });

        socket.on('disconnect', async () => {
            try {
                const decoded = verifyToken(data.token);
                if (!decoded) return;

                const res = await this.userController.updateUser(decoded.id, { isOnline: false });
                if (!res) return;

                this.io.emit(`user-${data.userId}`, res);
            } catch (err) { }
        });
    }
}