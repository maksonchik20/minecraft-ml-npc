module.exports = {
    settings: {
        host: 'localhost',
        port: 25565,
        username: 'Cyn'
    },
    additionalBehaviors: [
        {name: 'hello', behavior: require('./hello')},
        {name: 'customInterest', behavior: require('./customInterest')}
    ]
}