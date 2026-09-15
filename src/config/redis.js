import { configDotenv } from "dotenv";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_USR
    ? `redis://${process.env.REDIS_USR}:${encodeURIComponent(process.env.REDIS_PWD)}@${process.env.REDIS_SRV}:6379`
    : `redis://:${encodeURIComponent(process.env.REDIS_PWD)}@${process.env.REDIS_SRV}:6379`;

const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('Redis error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('redisClient connected successfully')
    } catch (e) {
        console.error('Redis connect failed', e);
    }
})();

export default redisClient;