import { Router } from "express";
import { authMiddleware, adminMiddleware, recruiterMiddleware } from "../middleware/auth.middleware.js";
import { FeedbackController } from "../controllers/index.js";

const router = Router();
const feedbackController = new FeedbackController();

router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const feedbacks = await feedbackController.getAll();
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedbacks = await feedbackController.getUserFeedback(req.user.id);
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.getFeedback(req.params.id);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.addFeedback(req.body);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.updateFeedback(req.user.id, req.params.id, req.body);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.deleteFeedback(req.user.id, req.params.id);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});