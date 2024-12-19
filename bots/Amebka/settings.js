module.exports = {
    settings: {
        host: '10.82.28.244',
        port: 25565,
        username: 'bot'
    },
    additionalBehaviors: [{name: 'web_view', behavior: require('./browserview.js')},
        {name:'start_explore', behavior: require('./explore.js')},
        {name:'jokes', behavior:require('./gptjoke.js')}
    ]
}
