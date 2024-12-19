const { ChatYandexGPT } = require('@langchain/yandex/chat_models');

function add(console, bot) {
    
    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    const headers = {
        'Authorization': 'Bearer ' + process.env.GPT_TOKEN
    }

    const GPT = new ChatYandexGPT({
        iamToken: process.env.GPT_TOKEN,
        modelURI: 'gpt://b1glpqm6du4km50rq59p/yandexgpt/latest',
        maxTokens: 1000,
        maxRetries: 5,
        temperature: 0
    })
    
    bot.behaviors.gpt = {}

    bot.behaviors.gpt.model = GPT;

    bot.behaviors.gpt.ask = async (messages) => {
        let data = {}
        data['modelUri'] = 'gpt://b1glpqm6du4km50rq59p/yandexgpt-32k/latest'
        data['completionOptions'] = {'stream': false,
            'temperature': 0.3,
            'maxTokens': 1000}
        data['messages'] = messages
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