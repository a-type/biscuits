import { Router, json } from 'express';
import tokenHandler from './token.js';

const verdantRouter: Router = Router();
verdantRouter.use(json());

verdantRouter.use('/token', tokenHandler);

export default verdantRouter;
