const Ajv = require("ajv")
const fs = require('fs/promises')

async function add(console, bot) {

    const ajv = new Ajv();

    let gptTask = new Promise((resolve) => {
        resolve('');
    })

    let idleCycles = 0
    const maxIdleCycles = 10
    
    bot.behaviors.eventPool = {}
    
    bot.behaviors.eventPool.pending = false;
    
    bot.behaviors.eventPool.pool = []
    bot.behaviors.eventPool.reRun = false;
    
    bot.behaviors.eventPool.addEvent = (event_type, event) => {
        idleCycles = maxIdleCycles;
        bot.behaviors.eventPool.pool.push(`[${event_type}]: ${event}`)
    }

    let memory = []
    memory = JSON.parse(await fs.readFile('./bots/Cyn/memory/history.json')).messages

    bot.on('end', async () => {
        bot.behaviors.eventPool.addEvent('Бот', 'Ты покинул игру')
        await fs.writeFile('./bots/Cyn/memory/history.json', JSON.stringify({messages: memory}, null, 4));
    })

    bot.on('chat', (username, message) => {
        if(username == bot.username) return;
        bot.behaviors.eventPool.addEvent(`Чат`, `Игрок "${username}" отправил сообщение "${message}"`);
    })

    let gptAnswer = ajv.compile({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                command_type: {type: 'string'}
            },
            required: ['command_type']
        }
    })

    let commandSchemas = {
        'follow': ajv.compile({
            type: "object",
            properties: {
                command_type: {type: "string", pattern: "^follow$"},
                player_name: {type: "string"}
            },
            additionalProperties: false,
            required: ["command_type", "player_name"]
        }),
        'stop_follow': ajv.compile({
            type: "object",
            properties: {
                command_type: {type: "string", pattern: "^stop_follow$"},
                player_name: {type: "string"}
            },
            additionalProperties: false,
            required: ["command_type", "player_name"]
        }),
        'chat': ajv.compile({
            type: "object",
            properties: {
                command_type: {type: "string", pattern: "^chat$"},
                message: {type: "string", minLength: 1}
            },
            additionalProperties: false,
            required: ["command_type", "message"]
        })
    }

    function validateCommand(obj) {
        if(commandSchemas[obj.command_type] == undefined) {
            throw new Error(`Команды "${obj.command_type}" не существует, попробуй ещё раз`)
        }
        result = commandSchemas[obj.command_type](obj)
        if(!result) {
            throw new Error(`Команда "${obj.command_type}" в неправильном формате, попробуй ещё раз`)
        }
    }

    function runCommand(obj) {
        switch (obj.command_type) {
            case 'chat':
                bot.chat(obj.message)
                bot.behaviors.eventPool.addEvent('Команда', '"chat" успешно выполнена, это результат выполнения команды, не обращай внимание');
                break;
            default:
                bot.behaviors.eventPool.addEvent('Команда', `"${obj.command_type}" успешно выполнена, это результат выполнения команды, не обращай внимание`);
                console.log(`Not supported yet ${obj.command_type}`)
                break;
        }
    }

    bot.behaviors.eventPool.sendToGpt = async (messages) => {
        let res = (await bot.behaviors.gpt.ask(messages)).result.alternatives[0].message.text;
        if(res.startsWith('```')) {
            res = res.substring(3, res.length);
        }
        if(res.endsWith('```')) {
            res = res.substring(0, res.length - 3);
        }

        if(res.startsWith('[REASONING]')) {
            bot.behaviors.eventPool.reRun = true;
            return {res: res, status: true};
        }

        try {

            let json = undefined;

            try {
                json = JSON.parse(res);
            } catch {
                throw new Error('Формат ответа должен быть json, попробуй ещё раз')
            }

            if(!gptAnswer(json)) {
                throw new Error('Ты используешь неправильный формат ответа, попробуй ещё раз')
            }

            if(json != undefined) {
                json.forEach((command) => {
                    validateCommand(command);
                })
            } else {
                throw new Error('Ты используешь неправильный формат ответа, попробуй ещё раз')
            }

            return {res: json, status: true};
        } catch(e) {
            console.error(e);
            return {res: res, status: false, errorStr: e};
        }
    }
    
    bot.behaviors.eventPool.send = async () => {
        bot.behaviors.eventPool.pending = true;

        let text = ''
        bot.behaviors.eventPool.pool.forEach(event => {
            text += event;
            text += '\n'
        });
        bot.behaviors.eventPool.pool = []
        if(text !== '') {
            memory.push({
                'role': 'user',
                'text': text
            })
        }
        
        let messages = bot.config.startPrompt;
        memory.forEach(message => {
            messages.push(message)
        });
        
        let sendResult = await bot.behaviors.eventPool.sendToGpt(messages)

        let nTry = 1;
        const maxTries = 5;

        while(!sendResult.status) {
            nTry++;
            let tmpMessages = messages;
            tmpMessages.push({
                'role': 'assistant',
                'text': sendResult.res
            });
            tmpMessages.push({
                'role': 'user',
                'text': `[Неправильный ответ]: ${sendResult.errorStr}`
            });
            sendResult = await bot.behaviors.eventPool.sendToGpt(tmpMessages)
            if(nTry > maxTries && !sendResult.status)
                break;
        }

        if(!sendResult.status) {
            console.error('GPT Failed to answer');
            bot.chat('Sowwy! My gpt is faiwled ~')
        } else {
            memory.push({role: 'assistant', text: (typeof sendResult.res == 'string') ? sendResult.res : JSON.stringify(sendResult.res)})
            if(typeof sendResult.res != 'string') {
                sendResult.res.forEach((command) => {
                    runCommand(command);
                })
            }
        }

        if(bot.behaviors.eventPool.reRun) {
            bot.behaviors.eventPool.reRun = false;
            gptTask = bot.behaviors.eventPool.send()
        }

        bot.behaviors.eventPool.pending = false;
    }

    let idleTask = setInterval(() => {
        if(idleCycles > 0) {
            idleCycles--;
        }
        if(idleCycles == 0 && bot.behaviors.eventPool.pool.length != 0 && !bot.behaviors.eventPool.pending) {
            gptTask = bot.behaviors.eventPool.send()
        }
    }, 50)

    bot.on('end', () => {
        clearInterval(idleTask)
    })
}

module.exports = add