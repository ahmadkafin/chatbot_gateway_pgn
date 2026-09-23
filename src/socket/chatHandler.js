import chatServices from "../services/chatServices.js";
import { receiveMessage } from "./emit/reieve_message.emit.js";

export default (io) => {
    io.on("connection", (socket) => {
        console.log("⚡ User connected:", socket.id);

        socket.on("send_message", async (data) => {
            try {
                const { message } = data;
                // console.log(`question is ${data}`)
                console.log("Data yang diterima backend:", data);
                await chatServices.chatProcess(socket.id, message);

            } catch (error) {
                console.error("Socket Error:", error.message);
                socket.emit("receive_message", {
                    answer: "Maaf, saya gagal mengakses data saat ini.",
                    error: true
                });
            }
        });

        socket.on("user_ask", async (data) => {
            try {
                const { question, username } = data;
                console.log("Data (stream) yang diterima backend:", data);
                const finalName = socket.session?.usersNames || username || 'User';
                await chatServices.chatProcessStream(socket.id, question, finalName);
            } catch (error) {
                console.error("Socket Error:", error);
                socket.emit("ai_stream", {
                    type: 'error',
                    message: "Maaf, saya gagal mengakses data saat ini."
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    })
}