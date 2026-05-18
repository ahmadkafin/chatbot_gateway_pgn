import chatServices from "../services/chatServices.js";

class ChatController {
    async chatHandleClient(req, res) {
        try {
            const { question } = req.body;
            const response = chatServices.chatProcess(question);
            return res.status(200).json({
                status: 200,
                message: response,
                timestamps: new Date(),
            });
        } catch (e) {
            console.error(`Server Error with message ${e.message}`);
            return res.status(500).json({
                status: 500,
                message: "Server error",
                timestamps: new Date(),
            })
        }
    }
}

const chatController = new ChatController();
export default chatController;