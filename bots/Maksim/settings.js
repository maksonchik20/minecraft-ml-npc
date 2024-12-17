module.exports = {
    settings: {
        host: '10.82.50.66',
        port: 25565,
        username: 'sigma'
    },
    additionalBehaviors: [
        {name: 'guard', behavior: require('./guardBehavior')},
        {name: 'sleep', behavior: require('./sleepBehavior')}
    ]
}