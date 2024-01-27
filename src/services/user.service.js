import { User, Document, Language, Skill, Education, Experience } from "../models/index.js";

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
}