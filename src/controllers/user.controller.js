import { User } from "../models/index.js";
import { UserService, EducationService, SkillsService, LanguageService, ExperienceService, DocumentService } from "../services/index.js";
export class UserController {
    constructor() {
        this.userService = new UserService();
        this.educationService = new EducationService();
        this.skillService = new SkillsService()
        this.languageService = new LanguageService();
        this.experienceService = new ExperienceService();
        this.documentService = new DocumentService();
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<object>}
     */
    async getUser(id) {
        return (await this.userService.getById(id));
    }

    /**
     * @returns {Promise<object[]>}
     */
    async getAllUsers() {
        return (await this.userService.getAll());
    }

    /**
     * 
     * @param {number} id 
     * @param {User} body 
     * @param {boolean} admin - If the update request is made by an admin
     * @returns {Promise<boolean>}
     */
    async updateUser(id, body, admin = false) {
        if (!admin) {
            // ------------------------------------------------------
            // Remove role, organizations and groups from body. These properties are not allowed to be updated by the 'self' user
            if (body.role) delete body.role;
            if (body.organizations) delete body.organizations;
            if (body.groups) delete body.groups;
            if (body.password) delete body.password;
            // ------------------------------------------------------
        }

        return (await this.userService.update(id, body))[0] > 0;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async deleteUser(id) {
        return (await this.userService.delete(id)) > 0;
    }

    /**
     * Get all user skills
     * 
     * @param {number} id - THe user id
     * 
     * @returns {Promise}
     */
    async getUserSkills(id) {
        return (await this.skillService.getUserSkills(id));
    }

    /**
     * Add a new skill to the user
     * 
     * @param {number} id - The user id
     * @param {object} body - The skill object
     * 
     * @returns {Promise}
     */
    async addUserSkill(id, body) {
        body['applicantId'] = id;
        return (await this.skillService.addSkill(body));
    }

    /**
     * Update a user skill
     * 
     * @param {number} userId - The user id
     * @param {number} skillId - The skill id
     * @param {object} body - The skill object
     * 
     * @returns {Promise}
     */
    async updateUserSkill(userId, skillId, body) {
        return (await this.skillService.updateSkill(userId, skillId, body));
    }

    /**
     * Delete a user skill
     * 
     * @param {number} id - The user id
     * @param {number} skillId - The skill id
     * 
     * @returns {Promise<boolean>}
     */
    async deleteUserSkill(userId, skillId) {
        return (await this.skillService.deleteSkill(userId, skillId));
    }

    /**
     * Get all user educations
     * 
     * @param {number} id - The user id
     * 
     * @returns {Promise}
     */
    async getUserEducations(id) {
        return (await this.educationService.getUserEducation(id));
    }

    /**
     * Add a new education to the user
     * 
     * @param {number} id - The user id
     * @param {object} body - The education object
     * 
     * @returns {Promise}
     */
    async addUserEducation(id, body) {
        body['applicantId'] = id;
        return (await this.educationService.addEducation(body));
    }

    /**
     * Update a user education
     * 
     * @param {number} userId - The user id
     * @param {number} educationId - The education id
     * @param {object} body - The education object
     * 
     * @returns {Promise}
     */
    async updateUserEducation(userId, educationId, body) {
        return (await this.educationService.updateEducation(userId, educationId, body));
    }

    /**
     * Delete a user education
     * 
     * @param {number} userId - The user id
     * @param {number} educationId - The education id
     * 
     * @returns {Promise<boolean>}
     */
    async deleteUserEducation(userId, educationId) {
        return (await this.educationService.deleteEducation(userId, educationId));
    }

    /**
     * Get all user Experience
     * 
     * @param {number} id - The user id
     * 
     * @returns {Promise}
     */
    async getUserExperiences(id) {
        return (await this.experienceService.getUserExperience(id));
    }

    /**
     * Add a new experience to the user
     * 
     * @param {number} id - The user id
     * @param {object} body - The experience object
     * 
     * @returns {Promise}
     */
    async addUserExperience(id, body) {
        body['applicantId'] = id;
        return (await this.experienceService.addExperience(body));
    }

    /**
     * Update a user experience
     * 
     * @param {number} userId - The user id
     * @param {number} experienceId - The experience id
     * @param {object} body - The experience object
     * 
     * @returns {Promise}
     */
    async updateUserExperience(userId, experienceId, body) {
        return (await this.experienceService.updateExperience(userId, experienceId, body));
    }

    /**
     * Delete a user experience
     * 
     * @param {number} userId - The user id
     * @param {number} experienceId - The experience id
     * 
     * @returns {Promise<boolean>}
     */
    async deleteUserExperience(userId, experienceId) {
        return (await this.experienceService.deleteExperience(userId, experienceId));
    }

    /**
     * Get all user languages
     * 
     * @param {number} id - The user id
     * 
     * @returns {Promise}
     */
    async getUserLanguages(id) {
        return (await this.languageService.getUserLanguages(id));
    }

    /**
     * Add a new language to the user
     * 
     * @param {number} id - The user id
     * @param {object} body - The language object
     * 
     * @returns {Promise}
     */
    async addUserLanguage(id, body) {
        body['applicantId'] = id;
        return (await this.languageService.addLanguage(body));
    }

    /**
     * Update a user language
     * 
     * @param {number} userId - The user id
     * @param {number} languageId - The language id
     * @param {object} body - The language object
     * 
     * @returns {Promise}
     */
    async updateUserLanguage(userId, languageId, body) {
        return (await this.languageService.updateLanguage(userId, languageId, body));
    }

    /**
     * Delete a user language
     * 
     * @param {number} userId - The user id
     * @param {number} languageId - The language id
     * 
     * @returns {Promise<boolean>}
     */
    async deleteUserLanguage(userId, languageId) {
        return (await this.languageService.deleteLanguage(userId, languageId));
    }

    /**
     * Get all user documents
     * 
     * @param {number} id - The user id
     * 
     * @returns {Promise}
     */
    async getUserDocuments(id) {
        return (await this.documentService.getUserDocuments(id));
    }

    /**
     * Add a new document to the user
     * 
     * @param {number} id - The user id
     * @param {object} body - The document object
     * 
     * @returns {Promise}
     */

    async addUserDocument(id, body) {
        body['owner'] = id;
        return (await this.documentService.addDocument(body));
    }

    /**
     * Update a user document
     * 
     * @param {number} userId - The user id
     * @param {number} documentId - The document id
     * @param {object} body - The document object
     * 
     * @returns {Promise}
     */
    async updateUserDocument(userId, documentId, body) {
        return (await this.documentService.updateDocument(userId, documentId, body));
    }

    /**
     * Delete a user document
     * 
     * @param {number} userId - The user id
     * @param {number} documentId - The document id
     * 
     * @returns {Promise<boolean>}
     */

    async deleteUserDocument(userId, documentId) {
        return (await this.documentService.deleteDocument(userId, documentId));
    }

}