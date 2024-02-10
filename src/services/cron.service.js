import { QueueService } from "./index.js";
import cron from "node-cron";
export class CronService {
    constructor() {
        this.tasks = [];
    }

    /**
     * @param {Function} task
     */
    addTask(task) {
        this.tasks.push(task);
        return this;
    }

    async schedule() {
        cron.schedule('0 0 * * 1', async () => {
            this.tasks.forEach(async (task) => {
                await task();
            });
        });
    }
}