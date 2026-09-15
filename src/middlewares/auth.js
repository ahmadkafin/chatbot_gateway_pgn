import redisClient from '../config/redis.js';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'digio_sessionID';
const SESSION_NAME = process.env.SESSION_NAME || 'digio:sessions';
const SESSION_TYPE = process.env.SESSION_TYPE || 'string'; // Tipe data default di Redis

function parseCookieHeaderFor(cookieHeader = '', name) {
    if (!cookieHeader) return undefined;
    return cookieHeader.split(';')
        .map(s => s.trim())
        .find(s => s.startsWith(name + '='))
        ?.split('=')[1];
}

export default (io) => {
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            const sessionId = parseCookieHeaderFor(cookieHeader, SESSION_COOKIE_NAME);

            if (!sessionId) {
                return next(new Error("Authentication error: No session ID"));
            }

            const sessionKey = `${SESSION_NAME}:${sessionId}`;
            console.log("checking:", sessionKey);

            const exists = await redisClient.exists(sessionKey);
            if (!exists) {
                return next(new Error("Authentication error: Session expired or invalid"));
            }

            let session = null;
            if (SESSION_TYPE === 'string') {
                session = await redisClient.get(sessionKey);
            } else if (SESSION_TYPE === 'hash') {
                session = await redisClient.hGetAll(sessionKey);
            }

            if (session) {
                try {
                    socket.session =
                        typeof session === 'string'
                            ? JSON.parse(session)
                            : session;
                } catch {
                    socket.sessionRaw = session;
                }
                return next();
            } else {
                return next(new Error("Authentication error: Session data empty"));
            }

        } catch (e) {
            console.error("Auth Middleware Error:", e);
            return next(new Error("Authentication error: Server error"));
        }
    })
}