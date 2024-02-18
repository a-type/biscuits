import { Router } from 'itty-router';
import { verdantServer } from '../verdant/verdant.js';

export const verdantRouter = Router({
  base: '/verdant',
});

verdantRouter.all('/verdant', async (req) => {
  await verdantServer.handleRequest(req, res);
});

verdantRouter.all('/verdant/files/:fileId', async (req) => {
  await verdantServer.handleFileRequest(req, res);
});
