import aiEngine from "../api/aiClient.js";
import { receiveMessage } from "../socket/emit/reieve_message.emit.js";
import { updateStatus } from "../socket/emit/update_status.emit.js";

class ChatServices {
    async chatProcess(socketId, q) {
        try {
            updateStatus(socketId, "Sedang mencari data");
            const askQuestion = await aiEngine.ask(q);
            receiveMessage(socketId, askQuestion);
        } catch (e) {
            console.error(`Error di ChatServices ${e.message}`);
            throw e;
        }
    }
}

const chatServices = new ChatServices();
export default chatServices;