module.exports = {
    settings: {
        host: 'localhost',
        port: 44557,
        username: 'bot'
    },
    additionalBehaviors: [{name: 'web_view', behavior: require('./browserview.js')},
        {name:'start_explore', behavior: require('./explore.js')},
        {name:'jokes', behavior:require('./gptjoke.js')}
    ]
}
