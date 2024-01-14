import { Education } from "../models/index.js";

export class EducationService {
    constructor() {
        this.education = Education
    }

    async getAll() {
        const educations = await this.education.findAll();
        return educations.map((education) => education.dataValues);
    }

    async getUserEducation(userId) {
        const educations = await this.education.findAll({
            where: {
                applicantId: userId
            }
        })

        return educations.map((education) => education.dataValues);
    }

    async addEducation(body) {
        return (await this.education.create(body)).dataValues
    }

    async updateEducation(userId, id, body) {
        return (await this.education.update(body, {
            where: {
                id,
                applicantId: userId
            }
        })).length > 0;
    }

    async deleteEducation(userId, id) {
        return (await this.education.destroy({
            where: {
                id,
                applicantId: userId
            }
        }))
    }
}