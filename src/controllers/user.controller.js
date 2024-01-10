import { User } from "../models/index.js";
import { UserService } from "../services/index.js";
export class UserController {
    constructor() {
        this.userService = new UserService();
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
     * @returns {Promise<boolean>}
     */
    async updateUser(id, body) {
        // ------------------------------------------------------
        // Remove role, organizations and groups from body. These properties are not allowed to be updated by the 'self' user
        if (body.role) delete body.role;
        if (body.organizations) delete body.organizations;
        if (body.groups) delete body.groups;
        if (body.password) delete body.password;
        // ------------------------------------------------------

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
}