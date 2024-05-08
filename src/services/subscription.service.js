import { Subscription, Plan, Payment } from "../models/index.js";

export class SubscriptionService {
  constructor() {
    this.subscription = Subscription;
    this.plan = Plan;
    this.payment = Payment;
  }

  async createPayment(data) {
    const payment = await this.payment.create(data);
    return payment?.dataValues;
  }

  async updatePayment(requestId, data) {
    return (
      (
        await this.payment.update(data, {
          where: {
            requestId,
          },
        })
      ).length > 0
    );
  }

  async createSubscription(data) {
    const subscription = await this.subscription.create(data);
    return subscription?.dataValues;
  }

  async getUserSubscription(userId) {
    const subscription = await this.subscription.findOne({
      where: {
        applicantId: userId,
      },
    });
    return subscription?.dataValues;
  }

  async getSubscriptionByRequestId(requestId) {
    const subscription = await this.subscription.findOne({
      where: {
        requestId,
      },
      include: {
        model: Plan,
        as: "plan",
      },
    });
    return subscription?.dataValues;
  }

  async getSubscriptions() {
    const subscriptions = await this.subscription.findAll();
    return subscriptions.map((subscription) => subscription?.dataValues);
  }

  async updateSubscription(requestId, data) {
    return (
      (
        await this.subscription.update(data, {
          where: {
            requestId: requestId,
          },
        })
      ).length > 0
    );
  }

  async deleteSubscription(userId) {
    return (
      (await this.subscription.destroy({
        where: {
          applicantId: userId,
        },
      })) > 0
    );
  }

  async createPlan(data) {
    const plan = await this.plan.create(data);
    return plan;
  }

  async getPlan(id) {
    const plan = await this.plan.findOne({
      where: {
        id,
      },
    });
    return plan;
  }

  async getPlans() {
    const plans = await this.plan.findAll();
    return plans;
  }

  async updatePlan(id, data) {
    const plan = await this.plan.update(data, {
      where: {
        id,
      },
    });
    return plan;
  }

  async deletePlan(id) {
    const plan = await this.plan.destroy({
      where: {
        id,
      },
    });
    return plan;
  }

  async getSubscriptionByPlanId(planId) {
    const subscription = await this.subscription.findOne({
      where: {
        planId,
      },
    });
    return subscription;
  }

  async getSubscriptionByUserId(userId) {
    const subscription = await this.subscription.findOne({
      where: {
        applicantId: userId,
      },
    });
    return subscription;
  }
}
