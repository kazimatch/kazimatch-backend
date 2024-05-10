import { Queue, Worker } from 'bullmq'
import { config } from '../config/index.js'
import { NotificationService } from './index.js'
import chalk from 'chalk';
import { createClient } from 'redis';
import * as IORedis from 'ioredis';

export class QueueService {
 

    static init() {
        try {
            this.bull = new Queue('queue', {
                connection: {
                    host: config.Redis.host,
                    port: 6379s,
                }
            });

            this.bull.on("error", (err) => {
                console.error(chalk.red('Error initializing Queue', err))
            })

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
            worker.on("failed", (c) => {
                console.log("Worker ready")
            })

            worker.on('completed', (_) => {
                console.log("Job completed")
            });

            worker.on('failed', (_, err) => {
                console.log(chalk.red('Job failed', err));
            });


        } catch (err) {
            console.error(chalk.red('Error initializing Queue', err))
        }
    }
    /**
     * @param {string} type
     * @param {object} data
     * @param {Function?} handler;
     */
    static queue(type, data) {
        this.bull?.add(type, data)
    }
}