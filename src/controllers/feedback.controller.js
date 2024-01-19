import { FeedbackService } from "../services/index.js";

export class FeedbackController {
    constructor(){
        this.feedbackService = new FeedbackService();
    }

    async getAll(){
        return await this.feedbackService.getAll();
    }

    async getUserFeedback(applicantId){
        return await this.feedbackService.getUserFeedback(applicantId);
    }

    async getFeedback(id){
        return await this.feedbackService.getFeedback(id);
    }

    async addFeedback(userId, body){
        body['employerId'] = userId;
        return await this.feedbackService.addFeedback(body);
    }

    async updateFeedback(userId, id, body){
        return (await this.feedbackService.updateFeedback(userId, id, body));
    }

    async deleteFeedback(userId, id){
        return await this.feedbackService.deleteFeedback(userId, id);
    }
}