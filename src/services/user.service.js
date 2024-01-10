import { User } from "../models/index.js";

export class UserService {
    constructor() {
        this.user = User;
    }

    async getAll() {
        const users = await this.user.findAll({
            attributes: {
                exclude: ["password", 'refreshToken']
            }
        });
        return users.map(user => user.dataValues);
    }
    /**
     * 
     * @param {number} id 
     * @returns {Promise<object>}
     */
    async getById(id) {
        const user = await this.user.findByPk(id);
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