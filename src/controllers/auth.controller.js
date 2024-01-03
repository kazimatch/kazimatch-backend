import bcrypt from "bcryptjs";
import { UserService, QueueService } from "../services/index.js";
import { hashPassword, jwtToken, verifyToken } from "../utils/crypt.js";
import { register } from "../utils/template.js";
import { config } from "../config/config.js";
export class AuthController {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * @param { {email:'', 'password': ''}} body 
     * @returns 
    */
    async login(body) {
        const user = await this.userService.getByEmail(body.email);
        if (!user) throw new Error("Invalid credentials");

        await new Promise((resolve, reject) => {
            bcrypt.compare(body.password, user.password, (err, result) => {
                if (result) resolve(result);
                reject(new Error("Invalid credentials"));
            })
        });

        const token = jwtToken(user);
        const refreshToken = jwtToken(user, true);
        await this.userService.update(user.id, { refreshToken });

        user.token = token;
        user.refreshToken = refreshToken;
        delete user.password;

        return user;
    }
    /**
     * 
     * @param {{email:string, password:string, fullname:string }} body 
     * @returns 
     */
    async register(body) {
        var user = await this.userService.getByEmail(body.email);
        if (user) throw new Error("Email already exists");

        body.password = await hashPassword(body.password);
        user = await this.userService.create(body);

        const token = jwtToken(user);

        QueueService.queue("email", {
            to: user.email,
            subject: "Verify your email",
            html: register(
                {
                    name: user.fullname,
                    link: `${config.App.baseUrl}/api/${config.VERSION}/auth/verify?token=${token}`
                }
            )
        })

        return user;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async logout(id) {
        if (!token) throw new Error("Invalid token");
        return (await this.userService.update(id, { refreshToken: null })).length > 0;
    }

    async resetPassword(token, password) {
        const { id, email } = verifyToken(token);
        const res = await this.userService.update(Number(id), {
            password: await hashPassword(password)
        })

        if (res[0] > 0) {
            QueueService.queue("email", {
                to: email,
                subject: "Password reset",
                html: "Your password has been reset successfully"
            })
        }
        return res[0] > 0;
    }
    /**
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async verifyEmail(id) {
        return (await this.userService.update(id, { isVerified: true })).length > 0;
    }

    /**
     * 
     * @param {String} email 
     * @returns {Promise<boolean>}
     */
    async forgotPassword(email) {
        const user = await this.userService.getByEmail(email);
        if (!user) throw new Error("User not found");

        const token = jwtToken(user);
        QueueService.queue("email", {
            to: user.email,
            subject: "Reset your password",
            html: `Click <a href="${config.App.baseUrl}/api/${config.VERSION}/auth/reset-password?token=${token}">here</a> to reset your password`
        })

        return true;
    }
}