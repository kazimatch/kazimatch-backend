import { Feedback } from "../models/index.js";

export class FeedbackService {
    constructor(){
        this.feedback = Feedback
    }

    async getAll(){
        const feedbacks = await this.feedback.findAll();
        return feedbacks.map((feedback) => feedback.dataValues);
    }

    async getUserFeedback(applicantId){
        const feedbacks = await this.feedback.findAll({
            where: {
                applicantId
            }
        })

        return feedbacks.map((feedback) => feedback.dataValues);
    }

    async getFeedback(id){
        return (await this.feedback.findOne({
            where: {
                id
            }
        })).dataValues;
    }

    async addFeedback(body){
        return (await this.feedback.create(body))?.dataValues
    }

    async updateFeedback(userId, id, body){
        return (await this.feedback.update(body, {
            where: {
                id,
                employerId: userId
            }
        })).length > 0;
    }

    async deleteFeedback(userId, id){
        return (await this.feedback.destroy({
            where: {
                id,
                employerId: userId
            }
        })) > 0;
    }
}