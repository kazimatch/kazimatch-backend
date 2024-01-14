import { Document } from "../models/index.js";

export class DocumentService {
    constructor() {
        this.document = Document
    }

    async getAll() {
        const documents = await this.document.findAll();
        return documents.map((document) => document.dataValues);
    }

    async getUserDocument(userId) {
        const documents = await this.document.findAll({
            where: {
                applicantId: userId
            }
        })

        return documents.map((document) => document.dataValues);
    }

    async addDocument(body) {
        return (await this.document.create(body)).dataValues
    }

    async updateDocument(id, body) {
        return (await this.document.update(body, {
            where: {
                id
            }
        })).length > 0;
    }

    async deleteDocument(userId, id) {
        return (await this.document.destroy({
            where: {
                id,
                owner: userId
            }
        }))
    }
}