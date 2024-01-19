import { Job, Application, User } from "../models/index.js";

export class JobService {
    constructor() {
        this.job = Job;
        this.applications = Application;
    }

    async getAll() {
        const jobs = await this.job.findAll();
        return jobs.map((job) => job.dataValues);
    }

    async getJob(id) {
        return (await this.job.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Application,
                    as: "applications"
                },
                {
                    model: User,
                    as: 'user'
                }
            ]
        }))?.dataValues;
    }

    async getUserJobs(userId) {
        const jobs = await this.job.findAll({
            where: {
                owner: userId
            }
        })

        return jobs.map((job) => job?.dataValues);
    }

    async addJob(body) {
        return (await this.job.create(body)).dataValues
    }

    async updateJob(userId, id, body) {
        return (await this.job.update(body, {
            where: {
                id,
                owner: userId
            }
        })).length > 0;
    }

    async deleteJob(userId, id) {
        return (await this.job.destroy({
            where: {
                id,
                owner: userId
            }
        }))
    }

    async getJobApplications(jobId) {
        return (await this.applications.findAll({
            where: {
                job: jobId
            },
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ]
        }))
    }

    async addJobApplication(body) {
        return (await this.applications.create(body)).dataValues
    }

    async updateApplication(appId, status) {
        return (await this.applications.update(status, {
            where: {
                id: appId
            }
        })).length > 0;
    }

    async deleteApplication(userId, appId) {
        return (await this.applications.destroy({
            where: {
                id: appId,
                applicant: userId
            }
        })) > 0;
    }
}