import { Queue, Worker } from 'bullmq'
import { config } from '../config/index.js'
import { NotificationService } from './index.js'
import morgan from 'morgan';
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
        }, {
            connection: {
                host: config.Redis.host,
                port: config.Redis.port,
            }
        });

        worker.on('completed', (job) => {
            console.log(chalk.green('Job completed'));
        });

        worker.on('failed', (job, err) => {
            console.log(chalk.red('Job failed'));
        });
    }
    /**
     * @param {string} type
     * @param {object} data
     */
    static queue(type, data) {
        this.bull.add(type, data)
    }
}