import expres from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatHandler from './src/socket/chatHandler.js';
import { initSocket } from './src/socket/initSocket.js';

const app = expres();
const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: { origin: "*" }
// });

const io = initSocket(httpServer);
chatHandler(io);

httpServer.listen(3000);