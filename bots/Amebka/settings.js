module.exports = {
    settings: {
        host: '10.82.95.41',
        port: 25565,
        username: 'bot'
    },
    additionalBehaviors: [{name: web_view, behavior: require('./browserview.js')},
        {name:start_explore, behavior: require('./explore.js')}]
}