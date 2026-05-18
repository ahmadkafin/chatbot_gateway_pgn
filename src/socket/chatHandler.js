import chatServices from "../services/chatServices.js";
import { receiveMessage } from "./emit/reieve_message.emit.js";

export default (io) => {
    io.on("connection", (socket) => {
        console.log("⚡ User connected:", socket.id);
        socket.on("send_message", async (data) => {
            try {
                const { message } = data;
                await chatServices.chatProcess(socket.id, message);

            } catch (error) {
                console.error("Socket Error:", error.message);
                socket.emit("receive_message", {
                    answer: "Maaf, saya gagal mengakses data saat ini.",
                    error: true
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    })
}