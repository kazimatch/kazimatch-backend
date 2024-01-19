import { Router } from 'express';
import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import jobRouter from './job.router.js'
const router = Router();
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/jobs', jobRouter);


export default router;