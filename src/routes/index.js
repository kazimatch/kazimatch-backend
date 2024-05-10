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

import { NotificationService, QueueService } from '../services/index.js';

import { createClient } from 'redis';
import { config } from '../config/index.js'

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

router.get('/privacy-policy', (req, res) => {

    res.sendFile('public/privacy-policy.html', { root: './' });
});
router.get('/delete-acc', (req, res) => {

    res.sendFile('public/delete-account.html', { root: './' });
});

let temporaryStorage = {};

router.post('/delete-acc', async (req, res) => {
    try {
        const client = createClient({
            url: 'rediss://default:AVNS_5TJsKRHoDMNo3JeVkoF@redis-kazimatch-kazimatch.d.aivencloud.com:13866',
        });
        await client.connect();
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (temporaryStorage[email]) {
            return res.status(400).json({ message: 'Account deletion request already received' });
        }

        temporaryStorage[email] = true;

        client.set(email, email, {
            EX: 432000
        });

        // send email to user
        QueueService.queue("email", {
            to: email,
            subject: "KaziMatch Account Deletion",
            html: `
            <h1>Account Deletion Request</h1>
            <p>
            Hello, we have received your account deletion request, it will be automatically deleted 
            within 5 days. If you did not request this or you want to cancel the request, send an email to
           <strong> kazimatch@gmail.com </strong>
            </p> 
            `
        });

        return res.status(200).json({ message: 'Account deletion request received' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while deleting account' });
    }
});

export default router;