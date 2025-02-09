import moment from "moment";
import {
  MpesaService,
  QueueService,
  SubscriptionService,
  UserService,
} from "../services/index.js";
import { emailTemplate } from "../utils/template.js";

export class SubscriptionController {
  constructor() {
    this.mpesaService = new MpesaService();
    this.subscriptionService = new SubscriptionService();
    this.userService = new UserService();
  }

  async createSubscription(userId, data) {
    const user = await this.userService.getById(userId);

    const plan = await this.subscriptionService.getPlan(data.planId);
    if (!plan) return null;

    let phone = user.phoneNumber;

    if (phone.startsWith("0")) {
      phone = `254${phone.slice(1)}`;
    }

    const mpesaResponse = await this.mpesaService.stk(phone, plan.price, user.id, plan.dataValues.name);

    console.log(mpesaResponse);

    await this.subscriptionService.createPayment({
      requestId: mpesaResponse?.MerchantRequestID,
      status: "pending",
      applicantId: user.id,
      planId: plan.id,
    });

    if (mpesaResponse?.ResponseCode != "0") return null;

    const subscription = await this.subscriptionService.createSubscription({
      applicantId: user.id,
      planId: plan.id,
      requestId: mpesaResponse.MerchantRequestID,
    });

    return subscription;
  }

  async getUserSubscription(userId) {
    const subscription = await this.subscriptionService.getUserSubscription(
      userId
    );
    return subscription;
  }

  async getSubscriptions() {
    const subscriptions = await this.subscriptionService.getSubscriptions();
    return subscriptions;
  }

  async updateSubscription(requestId) {
    let data = {};

    await this.subscriptionService.updatePayment(requestId, {
      status: "success",
    });

    let subscription =
      await this.subscriptionService.getSubscriptionByRequestId(requestId);
    if (!subscription) return;

    subscription = {
      ...subscription,
      plan: subscription.plan.dataValues,
      user: subscription.user.dataValues
    };

    this.userService.update(subscription.applicantId, {
      isActivated: true,
    });

    data.status = "active";
    data.startDate = new Date();

    data.endDate =
      subscription.plan.cycle == "monthly"
        ? moment().add(1, "months").toDate()
        : moment().add(1, "years").toDate();

    QueueService.queue("email", {
      to: subscription.user.email,
      subject: "Subscription activated",
      html: emailTemplate({
        name: subscription.user.fullName,
        message: "Hello, your subscription has been activated successfully",
      })
    });

    return await this.subscriptionService.updateSubscription(requestId, data);
  }

  async deleteSubscription(userId) {
    return await this.subscriptionService.deleteSubscription(userId);
  }

  async createPlan(data) {
    const plan = await this.subscriptionService.createPlan(data);
    return plan;
  }

  async getPlan(id) {
    const plan = await this.subscriptionService.getPlan(id);
    return plan;
  }

  async getPlans() {
    const plans = await this.subscriptionService.getPlans();
    return plans;
  }

  async updatePlan(id, data) {
    return await this.subscriptionService.updatePlan(id, data);
  }

  async deletePlan(id) {
    return await this.subscriptionService.deletePlan(id);
  }
}
