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
        cron.schedule('* * * * *', async () => {
            this.tasks.forEach(async (task) => {
                await task();
            });
        });
    }
}