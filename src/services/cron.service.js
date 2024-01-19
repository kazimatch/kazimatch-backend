import { QueueService } from "./index.js";
import cron from "node-cron";
export class CronService {
    constructor() {
        this.scheduler("* * * * *");
    }

    /**
     * 
     * @param {string} period 
     */
    scheduler(period) {
        cron.schedule(period, async () => {
            QueueService.queue("feedback", {});
            QueueService.queue("subscription", {});
        });
    }
}