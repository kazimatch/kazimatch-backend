import { Router } from 'express';
import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import jobRouter from './job.router.js'
import messageRouter from './message.router.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/jobs', jobRouter);
router.use('/messages', messageRouter);


export default router;