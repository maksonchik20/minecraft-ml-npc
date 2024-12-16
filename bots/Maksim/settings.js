module.exports = {
    settings: {
        host: '10.82.95.41',
        port: 25565,
        username: 'sigma'
    },
    additionalBehaviors: [
        require('./guardBehavior')
    ]
}