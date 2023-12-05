import express from 'express';
import bodyParser from 'body-parser';
import { attach } from './verdant/verdant.js';
import { createServer } from 'http';
import cors from 'cors';
import apiRouter from './api/index.js';
import { createTrpcMiddleware } from './rpc/index.js';
import { productAdminSetup } from './tasks/productAdminSetup.js';
import { ALLOWED_ORIGINS } from './config/cors.js';

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use((req, res, next) => {
  // log the request details
  console.log(new Date().toISOString(), req.method, req.url.split('?')[0]);
  next();
});
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhook')) {
    next();
  } else {
    bodyParser.json({
      limit: '50mb',
    })(req, res, next);
  }
});
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Hello World! You shouldn't be here!");
});

app.use('/api', apiRouter);

const verdantServer = attach(server);
app.use('/verdant', async (req, res) => {
  await verdantServer.handleRequest(req, res);
});
app.use('/verdant/files/:fileId', async (req, res) => {
  await verdantServer.handleFileRequest(req, res);
});

app.use('/trpc', createTrpcMiddleware(verdantServer));

server.listen(4445, () => {
  console.log('http://localhost:4445');
});

productAdminSetup();
