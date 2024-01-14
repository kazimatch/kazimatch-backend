import { Skill } from "../models/index.js";

export class SkillsService {
    constructor() {
        this.skill = Skill
    }

    async getAll() {
        const skills = await this.skill.findAll();
        return skills.map((skill) => skill.dataValues);
    }

    async getUserSkills(userId) {
        const skills = await this.skill.findAll({
            where: {
                applicantId: userId
            }
        })

        return skills.map((skill) => skill.dataValues);
    }

    async addSkill(body) {
        return (await this.skill.create(body)).dataValues
    }

    async updateSkill(userId, id, body) {
        return (await this.skill.update(body, {
            where: {
                id,
                applicantId: userId
            }
        })).length > 0;
    }

    async deleteSkill(applicantId, id) {
        return (await this.skill.destroy({
            where: {
                id,
                applicantId: applicantId
            }
        })) > 0;
    }
}