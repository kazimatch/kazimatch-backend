import { Job, Application, User, Feedback } from "../models/index.js";
import { Op } from "sequelize";
/**
 * @typedef {Object} QueryOptions
 * @property {number?} limit
 * @property {number?} offset
 * @property {{[string]:any}} where
 * @property {{[string]:any}[]} orderBy
 */

export class JobService {
    constructor() {
        this.job = Job;
        this.applications = Application;
    }
    /**
     * 
     * @param {QueryOptions?} query 
     * @returns 
     */
    async getAll(query = null) {
        const jobs = await this.job.findAll({
            limit: query?.limit ?? 100,
            offset: query?.offset ?? 0,
            where: query?.where,
            order: query?.orderBy,
            include: [
                {
                    model: User,
                    as: 'employer'
                }
            ]
        });
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
                    as: 'employer'
                }
            ]
        }))?.dataValues;
    }

    /**
     * 
     * @param {number} userId 
     * @param {QueryOptions?} query 
     * @returns 
     */
    async getUserJobs(userId, query = null) {
        const jobs = await this.job.findAll({
            where: {
                ...query?.where,
                owner: userId,
            },
            limit: query?.limit ?? 100,
            offset: query?.offset ?? 0,
            include: [
                {
                    model: Application,
                    as: "applications"
                },
                {
                    model: User,
                    as: 'employer'
                }
            ]
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

    /**
     * 
     * @param {*} _ 
     * @param {*} jobId 
     * @param {QueryOptions} queryOptions 
     * @returns 
     */
    async getJobApplications(jobId, queryOptions = null) {
        let result = await this.applications.findAll({
            where: {
                job: jobId
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Job,
                },
                {
                    model: Feedback,
                    as: 'feedbacks'
                }
            ]
        });

        return result.map((app) => app.dataValues);
    }

    /**
    * @param {number} applicationId
    * @returns 
    */
    async getJobApplication(applicationId) {
        let result = await this.applications.findOne({
            where: {
                id: applicationId
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Job,
                }
            ]
        });

        return result?.dataValues;
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