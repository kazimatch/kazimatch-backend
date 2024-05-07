import { Router } from "express";
import { SubscriptionController } from "../controllers/index.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const subscriptionController = new SubscriptionController();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const subscription = await subscriptionController.createSubscription(req.user.id, req.body);
        if (!subscription) {
            return res.status(400).json({ message: "Bad request" });
        }
        return res.status(201).json(subscription);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/callback", async (req, res) => {
    try {
        const { MerchantRequestID, ResultCode } = req.body.Body.stkCallback;

        console.log(req.body.Body.stkCallback);

        if (ResultCode != 0) {
            return res.status(200).json({ message: "Bad request" });
        }

        const subscription = await subscriptionController.updateSubscription(MerchantRequestID, {
            status: "active",
        });

        if (!subscription) {
            return res.status(200).json({ message: "Bad request" });
        }

        return res.status(201).json(subscription);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const subscription = await subscriptionController.getUserSubscription(req.user.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        return res.json(subscription);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        return res.json(await subscriptionController.getSubscriptions());
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete("/me", authMiddleware, async (req, res) => {
    try {
        const status = await subscriptionController.deleteSubscription(req.user.id);
        if (!status) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        return res.status(204).json();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;