import { Router } from "express";
import { MessageController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();
const messageController = new MessageController();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const threads = await messageController.getUserThreads(req.user.id);
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const messages = await messageController.getThreadMessages(req.params.id);
        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const message = await messageController.addMessage(req.user.id, req.body);
        res.json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const message = await messageController.deleteMessage(req.user.id, req.params.id);
        res.json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
});

export default router;