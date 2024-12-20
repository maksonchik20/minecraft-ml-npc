module.exports = {
    settings: {
        host: '10.82.12.112',
        port: 25565,
        username: 'sigma'
    },
    additionalBehaviors: [
        {name: 'guard', behavior: require('./guardBehavior')},
        {name: 'sleep', behavior: require('./sleepBehavior')},
        {name: 'auto_eat', behavior: require('./auto_eatBehavior')},
    ]
}