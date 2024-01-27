import { Router } from "express";
import { SubscriptionController } from "../controllers/index.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const subscriptionController = new SubscriptionController();

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subscription = await subscriptionController.createPlan(req.body);
        if (!subscription) {
            return res.status(400).json({ message: "Bad request" });
        }
        return res.status(201).json(subscription);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const subscription = await subscriptionController.getPlan(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        return res.json(subscription);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        return res.json(await subscriptionController.getPlans());
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const subscription = await subscriptionController.updatePlan(req.params.id, req.body);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        return res.status(204).json();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const status = await subscriptionController.deletePlan(req.params.id);
        if (!status) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        return res.status(204).json();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;