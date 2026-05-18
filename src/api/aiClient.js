import 'dotenv/config'
import axios from 'axios'

const pythonEngineUrl = process.env.PYTHON_ENGINE_URL

/**
 * This class responsibility is to communicate with AI Engine
 * There's several method on this class.
 * each class throw an error.
 */

class AiEngine {
    async ask(q) {
        try {
            const response = await axios.post(`${pythonEngineUrl}/ask`, {
                question: q
            });
            return response;
        } catch (e) {
            console.error(`AI Engine Error : ${e.response?.data} || ${e.message}`);
            throw new Error("Gagal ambil data dari AI Engine");
        }
    }
}


const aiEngine = new AiEngine();
export default aiEngine;