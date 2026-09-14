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
            const response = await axios.post(`${pythonEngineUrl}/api/chat/ask`, {
                question: q
            });
            return response;
        } catch (e) {
            console.error(`AI Engine Error : ${e.response?.data} || ${e.message}`);
            throw new Error("Gagal ambil data dari AI Engine");
        }
    }

    async askStream(q, onData) {
        try {
            const response = await fetch(`${pythonEngineUrl}/api/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const eventData = JSON.parse(line.replace('data: ', ''));
                            onData(eventData);
                        } catch (err) {
                            console.error('Error parsing stream data', err);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`AI Engine Stream Error : ${e.message}`);
            throw new Error("Gagal ambil stream data dari AI Engine");
        }
    }
}

const aiEngine = new AiEngine();
export default aiEngine;