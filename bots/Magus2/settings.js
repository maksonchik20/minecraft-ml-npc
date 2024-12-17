module.exports = {
    settings: {
        host: 'localhost',
        port: 25565,
        username: 'Magus2'
    },
    additionalBehaviors: [
        {name: 'digging', behavior: require('./diggingBehavior')}
    ]
}