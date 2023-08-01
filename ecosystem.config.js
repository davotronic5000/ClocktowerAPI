module.exports = {
    apps: [
        {
            name: 'townsquare API',
            script: 'index.js',
            cwd: './townsquare/townsquare/server',
            instances: 1,
            autorestart: true,
            max_memory_resxtart: '1024M',
            watch: true,
            env: {},
        },
        {
            name: 'clocktower API',
            script: './ClocktowerAPI/dist/src/index.js',
            instances: 1,
            autorestart: true,
            watch: true,
            env: { NODE_PORT: 8081, PORT: 8081 },
        },
    ],
};
