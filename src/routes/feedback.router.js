import { Router } from "express";
import { authMiddleware, adminMiddleware, recruiterMiddleware } from "../middleware/auth.middleware.js";
import { FeedbackController } from "../controllers/index.js";

const router = Router();
const feedbackController = new FeedbackController();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedbacks = await feedbackController.getUserFeedback(req.user.id);
        return res.json(feedbacks);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.getFeedback(req.params.id);
        if (!feedback) {
            res.status(404).json({ message: 'Feedback not found' });
        }

        return res.json(feedback);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.addFeedback(req.body);
        return res.json(feedback);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/:id', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.updateFeedback(req.user.id, req.params.id, req.body);

        if (!feedback) {
            return res.status(400).json({ message: 'Bad Request' });
        }

        return res.json(feedback);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const feedback = await feedbackController.deleteFeedback(req.user.id, req.params.id);
        if (!feedback) {
            return res.status(400).json({ message: 'Bad Request' });
        }

        return res.json(feedback);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;