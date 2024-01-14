import { Experience } from "../models/index.js";

export class ExperienceService {
    constructor() {
        this.experience = Experience
    }

    async getAll() {
        const experiences = await this.experience.findAll();
        return experiences.map((experience) => experience.dataValues);
    }

    async getUserExperience(userId) {
        const experiences = await this.experience.findAll({
            where: {
                applicantId: userId
            }
        })

        return experiences.map((experience) => experience.dataValues);
    }

    async addExperience(body) {
        return (await this.experience.create(body)).dataValues
    }

    async updateExperience(userId, id, body) {
        return (await this.experience.update(body, {
            where: {
                id,
                applicantId: userId
            }
        })).length > 0;
    }

    async deleteExperience(userId, id) {
        return (await this.experience.destroy({
            where: {
                id,
                applicantId: userId
            }
        }))
    }
}