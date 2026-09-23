import aiEngine from "../api/aiClient.js";
import { receiveMessage } from "../socket/emit/reieve_message.emit.js";
import { updateStatus } from "../socket/emit/update_status.emit.js";
import { getIO } from "../socket/initSocket.js";

class ChatServices {
    async chatProcess(socketId, q) {
        try {
            updateStatus(socketId, "Sedang mencari data");
            const askQuestion = await aiEngine.ask(q);
            // console.log(`answer is ${JSON.stringify(askQuestion.data)}`);
            receiveMessage(socketId, askQuestion.data);
        } catch (e) {
            console.error(`Error di ChatServices ${e.message}`);
            throw e;
        }
    }

    async chatProcessStream(socketId, q, name) {
        try {
            updateStatus(socketId, "Sedang menyiapkan jawaban");
            const io = getIO();
            await aiEngine.askStream(q, name, (eventData) => {
                // eventData might have { type: 'tool_start' | 'token' | 'done', ... }
                io.to(socketId).emit('ai_stream', eventData);
            });
        } catch (e) {
            console.error(`Error di ChatServices stream ${e.message}`);
            throw e;
        }
    }
}

const chatServices = new ChatServices();
export default chatServices;