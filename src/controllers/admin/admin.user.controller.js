import { UserService } from "../../services/index.js";

export class AdminUserController {
    constructor() {
        this.userService = new UserService();
    }

    async allUsers() {
        return (await this.userService.getAll())
    }

}