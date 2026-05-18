import { Server } from 'socket.io';

/**
 * Listen socket connection
 */

let io;

export const initSocket = (server) => {
    io = new Server(server, { cors: { origin: "*" } });
    return io;
}

export const getIO = () => {
    if (!io) throw new Error("Socket belum di inisialisasi");
    return io;
}