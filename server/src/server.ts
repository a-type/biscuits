import { migrateToLatest } from '@biscuits/db';
import { serve } from '@hono/node-server';
import { Server } from 'http';
import { app } from './app.js';
import { PORT } from './config/deployedContext.js';
import { productAdminSetup } from './tasks/productAdminSetup.js';
import { writeSchema } from './tasks/writeSchema.js';
import { verdantServer } from './verdant/verdant.js';

console.log('Starting server...', new Date().toISOString());

await migrateToLatest();

const port = PORT;
if (process.env.NODE_ENV === 'development') {
	const { killPortProcess } = await import('kill-port-process');
	await killPortProcess(PORT);
}

const server = serve({ fetch: app.fetch, port: parseInt(port, 10) }) as Server;
verdantServer.attach(server, { httpPath: false });

server.addListener('listening', () => {
	console.log(`Server listening on port ${port}`);
});

productAdminSetup();
if (process.env.NODE_ENV === 'development') {
	setTimeout(writeSchema);
}
