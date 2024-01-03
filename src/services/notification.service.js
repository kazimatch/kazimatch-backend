import Mail from "nodemailer/lib/mailer/index.js";
import { config } from "../config/index.js";
import { createTransport } from "nodemailer";

export class NotificationService {
    static transporter = createTransport({
        host: config.SMTP.host,
        port: config.SMTP.port,
        secure: false,
        auth: config.SMTP.auth
    });

    /**
     * @param {Mail.Options} body 
     */
    static async sendEmail(body) {
        await this.transporter.sendMail(body);
    }

}
