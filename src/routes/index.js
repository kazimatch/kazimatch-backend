import { Router } from 'express';
import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import jobRouter from './job.router.js'
import messageRouter from './message.router.js';
import subscriptionRouter from './subscription.router.js';
import plansRouter from './plans.router.js';
import feedbacksRouter from './feedback.router.js';
import adminRouter from './admin.router.js';
import documentRouter from './document.router.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware.js';

import { NotificationService } from '../services/notification.service.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/jobs', jobRouter);
router.use('/threads', messageRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/plans', plansRouter);
router.use('/feedbacks', feedbacksRouter);
router.use('/files', documentRouter);
router.use('/admin', authMiddleware, adminMiddleware, adminRouter);
router.use('/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await NotificationService.getNotifications(req.user.id);
        if (notifications) {
            return res.status(200).json(notifications.map(n => n.dataValues));
        }

        return res.status(404).json({ message: 'No notifications found' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while fetching notifications' });
    }
});

router.get('/', (req, res) => {
    res.send('Welcome to KaziMatch API');
});

export default router;