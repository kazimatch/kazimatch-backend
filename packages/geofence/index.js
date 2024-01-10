import chalk from "chalk";
import { config } from "../../src/config/index.js";

export class GeofenceClient {

    /**
     * Get user from geofence
     * @param {{field: "id" | "name", value: string | number}} options
     * @returns {Promise<any>}
     */
    async getUser(options) {
        try {
            if (!options) throw new Error("Options is required");
            if (!options.field) throw new Error("Field is required");
            if (!options.value) throw new Error("Value is required");

            const url = new URL(`${config.GEOFENCE.user}/${options.field}/${options.value}`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            return (await response.json());
        } catch (err) {
            console.log(chalk.red(err));
        }
    }

    /**
     * Fetch all roles from geofence
     * @param {string} term
     * @param {number} page
     * @param {number} entries
     * @returns {Promise<[]>}
     */
    async getRoles(term, page, entries) {
        try {
            const url = new URL(`${config.GEOFENCE.group}`);
            url.searchParams.append("nameLike", term);
            url.searchParams.append("page", page);
            url.searchParams.append("entries", entries);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            return (await response.json());
        } catch (err) {
            console.log(chalk.red(err));
        }

    }
}