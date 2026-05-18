import chatController from "../controllers/chatController.js"
import auth from "../middlewares/auth.js";

module.exports = (app) => {
    app.post('/logs/', chatController.chatHandleClient);
}

