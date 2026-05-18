/**
 * update status to send to client
 */

import { getIO } from "../initSocket.js"

export const updateStatus = (socketId, message) => {
    const io = getIO();

    io.to(socketId).emit("status", {
        success: true,
        message: message,
        timestamps: new Date(),
    })
}