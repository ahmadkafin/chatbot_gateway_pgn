import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatHandler from './src/socket/chatHandler.js';
import { initSocket } from './src/socket/initSocket.js';
import auth from './src/middlewares/auth.js';

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: { origin: "*" }
// });

const PORT = 3008;

app.get('/', (req, res) => {
    res.json({ "msg": "Hello from chatbot gateway with port 3008" });
});

const io = initSocket(httpServer);
auth(io);
chatHandler(io);

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://10.129.14.140:${PORT}`);
});