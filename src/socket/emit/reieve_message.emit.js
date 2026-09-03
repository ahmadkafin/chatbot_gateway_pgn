import { getIO } from "../initSocket.js"

export const receiveMessage = (socketId, answer) => {
    const io = getIO();
    io.to(socketId).emit("receive_message", { answer, timestamp: new Date() });
}