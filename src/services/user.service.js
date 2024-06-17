import { User, Document, Language, Skill, Education, Experience, Referral, Notification } from "../models/index.js";
import { hashPassword } from "../utils/crypt.js";

const attrs = {
    attributes: {
        exclude: ["password", 'refreshToken']
    }
}

export class UserService {
    constructor() {
        this.user = User;

    }

    async getAll() {
        const users = await this.user.findAll({
            ...attrs,
        });
        return users.map(user => user.dataValues);
    }
    /**
     * 
     * @param {number} id 
     * @returns {Promise<object>}
     */
    async getById(id) {
        const user = await this.user.findByPk(id, {

            include: [
                {
                    model: Education,
                    as: "educations"
                },
                {
                    model: Skill,
                    as: "skills"
                },
                {
                    model: Experience,
                    as: "experiences"
                },
                {
                    model: Language,
                    as: "languages"
                },
                {
                    model: Document,
                    as: "documents"
                },
                {
                    model: Referral,
                    include: [
                        {
                            model: User,
                            as: "referee"
                        }
                    ],
                    as: "referrals"
                },
                {
                    model: Referral,
                    include: [
                        {
                            model: User,
                            as: "referrer"
                        },
                        {
                            model: User,
                            as: "referee"
                        }
                    ],
                    as: "referees"
                }

            ]
        });
        return user?.dataValues;
    }

    /**
     * 
     * @param {string} email 
     * @returns 
     */
    async getByEmail(email) {
        const user = await this.user.findOne({
            where: {
                email
            },

        });
        return user?.dataValues;
    }

    async getByPhone(phoneNumber) {
        const user = await this.user.findOne({
            where: {
                phoneNumber
            },

        });
        return user?.dataValues;
    }

    /**
     * @param {*} body 
     * @returns 
     */
    async create(body) {
        return (await this.user.create(body)).dataValues;
    }

    async update(id, body) {
        return await this.user.update(body, {
            where: {
                id
            }
        });
    }

    async delete(id) {
        return await this.user.destroy({
            where: {
                id
            },

        },);
    }

    async getUserReferrals(userId) {
        return (await Referral.findAll({
            where: {
                from: userId
            },
            include: [
                {
                    model: User,
                    as: 'referrer'
                },
                {
                    model: User,
                    as: 'referee'
                },
            ],
            ...attrs
        })).map(user => user.dataValues);
    }

    async getRefereeReferrals(userId) {
        return (await Referral.findAll({
            where: {
                to: userId
            },
            ...attrs
        })).map(user => user.dataValues);
    }

    async addUserReferral(userId, user) {
        let existingUser = await this.getByEmail(user.email);
        const isNewUser = !existingUser;

        let password = "";
        if (!existingUser) {
            const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            for (let i = 0; i < 8; i++) {
                password += alphabet[Math.floor(Math.random() * alphabet.length)];
            }

            user['password'] = await hashPassword(password);
            user['referredBy'] = userId;

            existingUser = (await this.user.create(user)).dataValues
        }

        const referral = (await Referral.create({
            from: userId,
            to: existingUser.id
        })).dataValues;

        const userProfile = await this.getById(userId);

        await Notification.create({
            message: `${userProfile.fullName} has requested you to be their referee. Click here to confirm the referral`,
            recipient: existingUser.id,
            action: "referral",
            resourceType: "referral",
            resourceId: referral.id
        })

        return {
            user: existingUser,
            password: password,
            referral,
            isNewUser
        }
    }

    async updateReferral(referralId, body) {
        return await Referral.update(body, {
            where: {
                id: referralId
            }
        });
    }

    async getReferralById(referralId) {
        return (await Referral.findByPk(referralId))?.dataValues;
    }
}