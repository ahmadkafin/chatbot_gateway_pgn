import redisClient from '../config/redis.js';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'digio_sessionID';
const SESSION_NAME = process.env.SESSION_NAME || 'digio:sessions';

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
            // TODO: SEMENTARA (Hapus/comment blok ini nanti jika sudah selesai testing)
            // Bypass autentikasi jika koneksi berasal dari localhost:5173
            const origin = socket.handshake.headers.origin;
            if (origin && origin.includes('http://localhost:5173')) {
                console.warn("[!] Auth Middleware: Mem-bypass pengecekan untuk localhost:5173");
                socket.session = { id: 'dummy_local_session', bypassed: true };
                return next();
            }

            const cookieHeader = socket.request.headers.cookie;
            const sessionId = parseCookieHeaderFor(cookieHeader, SESSION_COOKIE_NAME);

            if (!sessionId) {
                return next(new Error("Authentication error: No session ID"));
            }

            const sessionKey = `${SESSION_NAME}:${sessionId}`;
            console.log("checking:", sessionKey);

            // Gunakan redisClient.type untuk mengetahui tipe data aslinya di Redis ('string', 'hash', dll)
            // Ini lebih aman daripada menebak dari env SESSION_TYPE
            const type = await redisClient.type(sessionKey);

            if (type === 'none') {
                return next(new Error("Authentication error: Session expired or invalid"));
            }

            let session = null;
            if (type === 'string') {
                session = await redisClient.get(sessionKey);
            } else if (type === 'hash') {
                session = await redisClient.hGetAll(sessionKey);
            } else {
                console.error(`Tipe data session di redis tidak dikenali: ${type}`);
            }

            if (session) {
                try {
                    socket.session =
                        typeof session === 'string'
                            ? JSON.parse(session)
                            : session;
                    console.log(socket.session);
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