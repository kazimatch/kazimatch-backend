import Mail from "nodemailer/lib/mailer/index.js";
import { config } from "../config/index.js";
import { createTransport } from "nodemailer";
import Pushy from "pushy";
import { Notification } from "../models/index.js";
export class NotificationService {
    static transporter = createTransport({
        host: config.SMTP.host,
        port: config.SMTP.port,
        secure: false,
        auth: config.SMTP.auth
    });

    static pushy = new Pushy(config.Pushy.key);

    /**
     * @param {Mail.Options} body 
     */
    static async sendEmail(body) {
        await this.transporter.sendMail(body);
    }

    /**
     * @param {{tokens: string[], title: string, body: string }} data
     */
    static async sendNotification(data) {
        const { tokens, title, body, userId } = data;
        await this.pushy.sendPushNotification({
            message: body
        }, tokens, {
            notification: {
                title,
                body
            }
        }, (err, id) => {
            if (err) {
                throw err;
            }
        });
    }

    static async addNotification(body) {
        return await Notification.create(body);
    }

    static async getNotifications(userId) {
        return await Notification.findAll({
            where: {
                recipient: userId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    static async getNotification(id) {
        return (await Notification.findByPk(id))?.dataValues;

    }

    static async updateNotification(id, body) {
        return await Notification.update(body, {
            where: {
                id
            }
        });
    }

}
