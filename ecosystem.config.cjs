module.exports = {
    apps: [
        {
            name: "chatbot_ulfa",
            script: "./server.js",
            instances: 1, // Diubah dari 'instance' menjadi 'instances'
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: "500M", // Diubah dari '16' (16 byte) menjadi 500 Megabytes
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            error_file: "./logs/pm2-err.log",
            out_file: "./logs/pm2-out.log",
            time: true,
        }
    ]
}