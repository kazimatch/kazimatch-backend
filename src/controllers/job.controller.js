import { Job } from "../models/index.js";
import { JobService, QueueService, UserService } from "../services/index.js";
import { emailTemplate } from "../utils/template.js";

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.userService = new UserService();
  }

  /**
   *
   * @param {number} id
   *
   * @returns {Promise<object>}
   */
  async getJob(id) {
    return await this.jobService.getJob(id);
  }

  /**
   * @param {Object} query
   *
   * @returns {Promise<object[]>}
   */
  async getAllJobs(query = null) {
    return await this.jobService.getAll(query);
  }

  /**
   *
   * @param {number} userId
   *
   * @param {Object} query
   *
   * @returns {Promise<object[]>}
   */
  async getUserJobs(userId, query) {
    const queryOptions = {
      limit: query?.limit ?? 100,
      offset: query?.offset ?? 0,
      where: {
        status: query?.status,
        title: query?.title ?? null,
        location: query?.location ?? null,
        type: query?.type ?? null,
        start: query?.start ?? null,
        end: query?.end ?? null,
        salary: query?.salary ?? null,
        skills: query?.skills ?? null,
      },
      orderBy: query?.orderBy,
    };

    Object.keys(queryOptions.where).forEach(
      (key) => queryOptions.where[key] == null && delete queryOptions.where[key]
    );

    return await this.jobService.getUserJobs(userId, queryOptions);
  }

  /**
   *
   * @param {number} userId
   * @param {Job} body
   *
   * @returns {Promise<object>}
   */
  async addJob(userId, body) {
    body["owner"] = userId;
    return await this.jobService.addJob(body);
  }

  /**
   *
   * @param {number} userId
   * @param {number} id
   * @param {Job} body
   *
   * @returns {Promise<boolean>}
   */
  async updateJob(userId, id, body) {
    return await this.jobService.updateJob(userId, id, body);
  }

  /**
   *
   * @param {number} userId
   * @param {number} id
   *
   * @returns {Promise<boolean>}
   */
  async deleteJob(userId, id) {
    return await this.jobService.deleteJob(userId, id);
  }

  /**
   * @param {number} userId
   */
  async getMyApplications(userId) {
    return await this.jobService.getMyApplications(userId);
  }

  /**
   *
   * @param {number} userId
   * @param {number} id
   * @param {any} query
   *
   * @returns {Promise<object[]>}
   */
  async getJobApplications(userId, id, query = null) {
    const job = await this.jobService.getJob(id);
    if (!job) return null;

    if (job.owner !== userId) return null;

    return await this.jobService.getJobApplications(id, query);
  }

  /**
   *
   * @param {number} userId
   * @param {any} body
   *
   * @returns {Promise<object[]>}
   */
  async addJobApplication(userId, jobId, body) {
    const job = await this.jobService.getJob(jobId);
    if (!job || job.status !== "accepting") return null;

    body["job"] = jobId;
    body["applicant"] = userId;

    return await this.jobService.addJobApplication(body);
  }

  /**
   *
   * @param {number} jobId
   * @param {number} appId
   * @param {any} body
   *
   * @returns {Promise<object[]>}
   */
  async updateApplication(jobId, appId, body) {
    const job = await this.jobService.getJob(jobId);
    if (!job) return null;

    const status = body.status;

    const application = await this.jobService.getJobApplication(appId);
    if (!application) return null;

    const res = await this.jobService.updateApplication(appId, status);
    if (!res) return null;

    const user = application.user.dataValues;

    QueueService.queue("email", {
      to: user.email,
      subject: `Application Update - ${job.title} `,
      html: emailTemplate({
        name: user.fullName,
        message: `Hello, your application for ${job.title} at ${job.employer.fullName} has been  ${status}`,
        sign:
          status === "accepted"
            ? "Look out for communications from the recruiter"
            : null,
      }),
    });

    return application;
  }

  /**
   * @param {number} userId
   * @param {number} jobId
   *
   * @returns {Promise<boolean>}
   */
  async deleteApplication(jobId, userId, appId) {
    const job = await this.jobService.getJob(jobId);
    if (!job) return null;

    const application = job.applications.find(
      (app) => app.dataValues.id == appId
    )?.dataValues;
    if (!application) return null;

    const res = await this.jobService.deleteApplication(userId, appId);
    if (!res) return null;

    const user = await this.userService.getById(userId);

    QueueService.queue("email", {
      to: user.email,
      subject: `Application Update - ${job.title} `,
      html: emailTemplate({
        name: user.fullName,
        message: `Hello, your application for ${job.title} at ${job.user.fullName} has been deleted`,
        sign: null,
      }),
    });

    return res;
  }
}
