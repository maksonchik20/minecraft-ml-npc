function add(console, bot) {

    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    const headers = {
        'Authorization': 'Bearer ' + process.env.GPT_TOKEN
    }
    
    bot.behaviors.gpt = {}

    bot.behaviors.gpt.ask = async (messages) => {
        let data = {}
        data['modelUri'] = 'gpt://b1glpqm6du4km50rq59p/yandexgpt-lite'
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
        return obj;
    }

}

module.exports = add;