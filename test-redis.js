import 'dotenv/config';
import redisClient from './src/config/redis.js';

async function check() {
    try {
        const keys = await redisClient.keys('digio:sessions:*');
        console.log("Keys found:", keys);
        if (keys.length > 0) {
            for (const key of keys) {
                const type = await redisClient.type(key);
                console.log(`Key: ${key} | Type: ${type}`);
                if (type === 'string') {
                    const val = await redisClient.get(key);
                    console.log(`Value: ${val}`);
                } else if (type === 'hash') {
                    const val = await redisClient.hGetAll(key);
                    console.log(`Value:`, val);
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
}

setTimeout(check, 1000);
