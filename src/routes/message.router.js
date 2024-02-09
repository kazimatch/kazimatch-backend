import { Router } from "express";
import { MessageController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();
const messageController = new MessageController();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const threads = await messageController.getUserThreads(req.user.id);
        return res.json(threads);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
});

router.get('/:id/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await messageController.getThreadMessages(req.params.id);
        if (!messages) return res.status(404).json({ message: 'Thread not found' });

        return res.json(messages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const message = await messageController.addMessage(req.user.id, req.body);
        return res.status(201).json(message);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const message = await messageController.deleteMessage(req.user.id, req.params.id);
        return res.json(message);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const messages = await messageController.deleteThread(req.params.id, req.user.id);
        return res.json(messages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong' })
    }
});

export default router;