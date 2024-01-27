import { Queue, Worker } from 'bullmq'
import { config } from '../config/index.js'
import { NotificationService } from './index.js'
import chalk from 'chalk';

export class QueueService {
    static bull = new Queue('queue', {
        connection: {
            host: config.Redis.host,
            port: config.Redis.port,
        }
    });

    static init() {
        const worker = new Worker('queue', async (job) => {
            if (job.name === 'email') {
                await NotificationService.sendEmail(job.data);
            }
            if (job.name === 'notification') {
                await NotificationService.sendNotification(job.data);
            }
        }, {
            connection: {
                host: config.Redis.host,
                port: config.Redis.port,
            }
        });

        worker.on('completed', (_) => {
            console.log("Job completed")
        });

        worker.on('failed', (_, err) => {
            console.log(chalk.red('Job failed', err));
        });
    }
    /**
     * @param {string} type
     * @param {object} data
     * @param {Function?} handler;
     */
    static queue(type, data) {
        this.bull.add(type, data)
    }
}