import { Sequelize } from 'sequelize'
import { config } from "./config.js";
import chalk from 'chalk';

export class Database {

    constructor() {
        this.sequelize = new Sequelize(`${config.DB.dialect}://${config.DB.username}:${config.DB.password}@${config.DB.host}:${config.DB.port}/${config.DB.database}`, {
            logging: false,
        })
    }

    async connect() {
        try {
            await this.sequelize.authenticate({
                logging: false,
            })
            console.log(chalk.green('Connection has been established successfully.'));
            return this;
        } catch (error) {
            console.error(chalk.red(`Unable to connect to the database: ${error}`));
        }
    }

    async sync(force = false) {
        try {
            await this.sequelize.sync({
                force, logging: false,
            })
            console.log(chalk.green('All models were synchronized successfully.'));
            return this;
        } catch (error) {
            console.error(chalk.red(`Unable to synchronize the models: ${error}`));
        }
    }

    async close() {
        try {
            await this.sequelize.close()
            console.log(chalk.green('Connection has been closed successfully.'));
        } catch (error) {
            console.error(chalk.red(`Unable to close the database: ${error}`));
        }
    }
}
