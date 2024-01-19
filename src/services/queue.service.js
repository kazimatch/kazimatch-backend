import { Queue, Worker } from 'bullmq'
import { config } from '../config/index.js'
import { JobService, NotificationService, UserService } from './index.js'
import morgan from 'morgan';
import chalk from 'chalk';
import { Job } from '../models/index.js';

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

            if (job.name === 'feedback') {
                await this.#handleFeedback();
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

    static #handleFeedback = async () => {
        const jobs = await Job.findAll({
            where: {
                end: {
                    [Op.lte]: Date.now()
                },
                status: "not-accepting",
                hasFeedback: false
            }
        });

        for (const job of jobs) {
            const applications = await new JobService().getJobApplications(job.id);
            let selectedApplicant = applications.find((application) => application.status === 'accepted');

            if (!selectedApplicant) continue;

            const userService = new UserService();

            const user = await userService.getById(selectedApplicant.applicant);
            const employer = await userService.getById(job.owner);

            await new NotificationService().addNotification({
                message: `Please provide feedback for ${user.fullName}`,
                recipient: employer.id,
                type: 'feedback'
            });

            if (employer.pushToken)
                await NotificationService.sendNotification({
                    title: 'Feedback',
                    body: `Please provide feedback for ${user.fullName}`,
                    tokens: [employer.pushToken]
                });

            await Job.update({
                hasFeedback: true
            }, {
                where: {
                    id: job.id
                }
            });
        }
    }
}