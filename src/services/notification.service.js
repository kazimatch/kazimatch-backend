import Mail from "nodemailer/lib/mailer/index.js";
import { config } from "../config/index.js";
import { createTransport } from "nodemailer";
import Pushy from "pushy";
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
        const { tokens, title, body } = data;
        await this.pushy.sendPushNotification({
            message: body
        }, tokens,{
            notification: {
                title,
                body
            }
        }, (err, id)=>{
            if(err){
                throw err;
            }
            console.log(id);
        });
    }

}
