import { Database } from "./database.js";
import { config } from "./config.js";

const database = new Database();

export {
    database,
    config
}