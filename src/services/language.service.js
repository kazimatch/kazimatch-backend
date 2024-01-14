import { Language } from "../models/index.js";

export class LanguageService {
    constructor() {
        this.language = Language
    }

    async getAll() {
        const languages = await this.language.findAll();
        return languages.map((language) => language.dataValues);
    }

    async getUserLanguages(userId) {
        const languages = await this.language.findAll({
            where: {
                applicantId: userId
            }
        })

        return languages.map((language) => language.dataValues);
    }

    async addLanguage(body) {
        return (await this.language.create(body)).dataValues
    }

    async updateLanguage(userId, id, body) {
        return (await this.language.update(body, {
            where: {
                id,
                applicantId: userId
            }
        })).length > 0;
    }

    async deleteLanguage(userId, id) {
        return (await this.language.destroy({
            where: {
                id,
                applicantId: userId
            }
        }))
    }
}