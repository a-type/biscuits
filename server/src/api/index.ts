import { Router } from 'express';
import authRouter from './auth/index.js';
import stripeRouter from './stripe/index.js';
import verdantRouter from './verdant/index.js';

const apiRouter: Router = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/stripe', stripeRouter);
apiRouter.use('/verdant', verdantRouter);

export default apiRouter;
