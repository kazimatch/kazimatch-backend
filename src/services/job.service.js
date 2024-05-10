import { Job, Application, User, Feedback, Document } from "../models/index.js";
import { Op, fn, col, where as Where, literal } from "sequelize";

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
    let where = {};

    const kv = Object.entries(query);

    for (var option of kv) {
      if (option[0] === "limit" || option[0] === "offset") continue;

      if (option[0] === "date") {
        where["createdAt"] = {
          [Op.gte]: option[1],
        };
        continue;
      }

      if (option[0] === "query") {
        where[Op.or] = [
          {
            title: {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
          {
            location: {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
          {
            category: {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
          {
            type: {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
          {
            skills: {
              // skills an array, match any
              [Op.contains]: [option[1]],
            },
          },
          {
            experience: {
              [Op.iLike]: `%${option[1]}%`,
            }
          },

          // find also in employer full name in user table
          {
            '$employer.fullName$': {
              [Op.iLike]: `%${option[1]}%`,
            },
          },
        ];
        continue;
      }

      if (option[0] === "rating") continue;


      where[option[0]] = {
        [Op.iLike]: `%${option[1]}%`,
      };
    }

    const jobs = await this.job.findAll({
      limit: query?.limit ?? 100,
      offset: query?.offset ?? 0,
      where: {
        [Op.or]: where,
      },
      order: query?.orderBy,
      include: [
        {
          required: true,
          model: User,
          as: "employer",
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: Feedback,
              as: "feedbacks",
            },
          ],
        },
      ],
    });

    let result = jobs.map((job) => {
      if (!query.rating) return job.dataValues;
      const avgRate =
        job.dataValues.employer.feedbacks.reduce(
          (acc, curr) => acc + curr.rating,
          0
        ) / job.dataValues.employer.feedbacks.length;

      if ((avgRate || 0) >= query.rating) {
        return job.dataValues;
      }
      return null;
    });

    return result.filter(Boolean);
  }

  async getTalentPool(userId) {
    const jobs = await this.job.findAll({
      where: {
        owner: userId,
      },
      subQuery: false,
      include: [
        {
          model: Application,
          as: "applications",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
        {
          model: User,
          as: "employer",
          exclude: ["password"],
          required: true,
        },
      ],
    });

    return jobs.map((job) => job.dataValues);
  }

  async getJob(id) {
    return (
      await this.job.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Application,
            as: "applications",
          },
          {
            model: User,
            as: "employer",
          },
        ],
      })
    )?.dataValues;
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
          as: "applications",
        },
        {
          model: User,
          as: "employer",
        },
      ],
      order: query?.orderBy ?? [["createdAt", "DESC"]]
    });

    return jobs.map((job) => job?.dataValues);
  }

  async addJob(body) {
    body.close = new Date(Date.now() + body.close * (24 * 60 * 60 * 1000))
    return (await this.job.create(body)).dataValues;
  }

  async updateJob(userId, id, body) {
    return (
      (
        await this.job.update(body, {
          where: {
            id,
            owner: userId,
          },
        })
      ).length > 0
    );
  }

  async deleteJob(userId, id) {
    return await this.job.destroy({
      where: {
        id,
        owner: userId,
      },
    });
  }

  /**
   * @param {number} userId
   */
  async getMyApplications(userId) {
    return (
      await this.applications.findAll({
        where: {
          applicant: userId,
        },
        include: [
          {
            model: Job,
            include: [
              {
                model: User,
                as: "employer",
              },
            ],
          },
        ],
      })
    ).map((app) => app.dataValues);
  }

  /**
   *
   * @param {*} _
   * @param {*} jobId
   * @param {{}} query
   * @returns
   */
  async getJobApplications(jobId, query = null) {
    let where = {};

    const kv = Object.entries(query);

    for (var option of kv) {
      if (option[0] === "rating") continue;
      if (option[0] === "limit" || option[0] === "offset") continue;

      if (option[0] === "dateApplied") {
        where[createdAt] = {
          [Op.gte]: new Date(option[1]),
        };
        continue;
      }

      where[option[0]] = {
        [Op.iLike]: `%${option[1]}%`,
      };
    }

    let result = await this.applications.findAll({
      where: {
        job: jobId,
        ...where,
      },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Job,
        },
        {
          model: Feedback,
          as: "feedbacks",
        },
      ],
    });

    return result
      .map((app) => app.dataValues)
      .filter((app) => {
        if (query.rating) {
          return (
            app.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
            app.feedbacks.length >=
            query.rating
          );
        }
        return true;
      });
  }

  /**
   * @param {number} applicationId
   * @returns
   */
  async getJobApplication(applicationId) {
    let result = await this.applications.findOne({
      where: {
        id: applicationId,
      },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Job,
        },
      ],
    });

    return result?.dataValues;
  }

  async addJobApplication(body) {
    return (await this.applications.create(body)).dataValues;
  }

  async updateApplication(appId, status) {
    return (
      (
        await this.applications.update(
          {
            status: status,
          },
          {
            where: {
              id: appId,
            },
          }
        )
      ).length > 0
    );
  }

  async deleteApplication(userId, appId) {
    return (
      (await this.applications.destroy({
        where: {
          id: appId,
          applicant: userId,
        },
      })) > 0
    );
  }
}
