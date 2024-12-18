function add(console, bot) {

    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    const headers = {
        'Authorization': 'Bearer ' + process.env.GPT_TOKEN
    }
    
    bot.behaviors.gpt = {}

    bot.behaviors.gpt.ask = async (messages, tools=[], maxTokens=1000) => {
        let data = {}
        data['modelUri'] = 'gpt://b1glpqm6du4km50rq59p/yandexgpt/latest'
        data['completionOptions'] = {'stream': false,
            'temperature': 0.4,
            'maxTokens': maxTokens}
        data['messages'] = messages
        data['tools'] = tools
        let responce = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        let obj = await responce.json()
        console.log('getted responce ' + JSON.stringify(obj))
        if(obj.error) {
            console.log('Crash messages' + JSON.stringify(messages));
            bot.end('botClosed');
        }
        return obj;
    }

}

module.exports = add;