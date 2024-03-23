import { Job, User, Application } from "./models/index.js";
import { Op } from "sequelize";
import {
  CronService,
  NotificationService,
  QueueService,
} from "./services/index.js";
import chalk from "chalk";

/**
 * All these tasks will run every minute in the background as a cron job
 * To add a new task, create a new function and add it to the cron job scheduler
 *
 * They shouldnt be run on the same thread as the server because they are blocking
 * and will slow down the server
 */

/**
 * This task will run every minute and send feedback to employers requesting feedback
 * for jobs that have ended
 */
const feedback = async () => {
  try {
    let jobs = await Job.findAll({
      where: {
        hasFeedback: false,
        end: {
          [Op.lte]: Date.now(),
        },
        status: "not-accepting",
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    console.log(chalk.magenta("Found", jobs.length, "jobs"));

    jobs = jobs.map((job) => {
      return {
        ...job.dataValues,
        user: job.user.dataValues,
      };
    });

    jobs.forEach(async (job) => {
      console.log("Sending feedback for job", job.id);
      const application = await Application.findOne({
        where: {
          job: job.id,
          status: "accepted",
        },
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      });
      if (!application) return;

      const applicant = application.user.dataValues;

      console.log("Sending feedback to", job.user.email);

      await NotificationService.addNotification({
        recipient: job.user.id,
        message: `How was your experience with ${applicant.fullName}?`,
        type: "feedback",
      });

      QueueService.queue("email", {
        to: job.user.email,
        subject: "Feedback",
        html: `
                    <h2>Feedback</h2>
                    <p>How was your experience with ${applicant.fullName}?</p>
                    <p> Log in to your KaziMatch app to give feedback </p>
                `,
        text: `
                    Feedback
                    How was your experience with ${applicant.fullName}?
                    Log in to your KaziMatch app to give feedback
                `,
      });

      if (job.user.pushToken)
        QueueService.queue("notification", {
          tokens: [job.user.pushToken],
          title: "Feedback",
          body: `How was your experience with ${applicant.fullName}?`,
        });

      await Job.update(
        { hasFeedback: true },
        {
          where: {
            id: job.id,
          },
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

new CronService().addTask(feedback).schedule();
