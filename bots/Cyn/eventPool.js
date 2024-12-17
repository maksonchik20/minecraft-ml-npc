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
    
    bot.behaviors.eventPool.addEvent = (event) => {
        idleCycles = maxIdleCycles;
        bot.behaviors.eventPool.pool.push({type: 'event', ...event})
    }

    let memory = []
    memory = JSON.parse(await fs.readFile('./bots/Cyn/memory/history.json')).messages

    bot.on('end', async () => {
        bot.behaviors.eventPool.addEvent({'event_type': 'bot_left'})
        await fs.writeFile('./bots/Cyn/memory/history.json', JSON.stringify({messages: memory}, null, 4));
    })

    bot.on('chat', (username, message) => {
        if(username == bot.username) return;
        bot.behaviors.eventPool.addEvent({'event_type': 'chat', 'player_name': username, 'message': message});
    })

    let gptAnswer = ajv.compile({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                type: {type: 'string', pattern: '^command$'},
                command_type: {type: 'string'}
            },
            required: ['type', 'command_type']
        }
    })

    let commandSchemas = {
        'follow': ajv.compile({
            type: "object",
            properties: {
                type: {type: "string", pattern: "^command$"},
                command_type: {type: "string", pattern: "^follow$"},
                player_name: {type: "string"}
            },
            additionalProperties: false,
            required: ["type", "command_type", "player_name"]
        }),
        'stop_follow': ajv.compile({
            type: "object",
            properties: {
                type: {type: "string", pattern: "^command$"},
                command_type: {type: "string", pattern: "^stop_follow$"},
                player_name: {type: "string"}
            },
            additionalProperties: false,
            required: ["type", "command_type", "player_name"]
        }),
        'chat': ajv.compile({
            type: "object",
            properties: {
                type: {type: "string", pattern: "^command$"},
                command_type: {type: "string", pattern: "^chat$"},
                message: {type: "string", minLength: 1, maxLength: 250}
            },
            additionalProperties: false,
            required: ["type", "command_type", "message"]
        })
    }

    function validateCommand(obj) {
        if(commandSchemas[obj.command_type] == undefined) {
            console.log(`Command not found ${obj.command_type}`)
            return false;
        }
        result = commandSchemas[obj.command_type](obj)
        if(!result) {
            console.error(`Wrong format of command ${obj.command_type}, ${JSON.stringify(obj)}`)
            return false;
        }
        return true;
    }

    function runCommand(obj) {
        switch (obj.command_type) {
            case 'chat':
                bot.chat(obj.message)
                bot.behaviors.eventPool.addEvent({'event_type': 'command_complete_ok', 'command_type': 'chat'});
                break;
            default:
                bot.behaviors.eventPool.addEvent({'event_type': 'command_complete_ok', 'command_type': obj.command_type});
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

        let errorStr = "Ты используешь не правильный формат ответа, попробуй ещё раз"

        try {
            let json = JSON.parse(res);

            if(!gptAnswer(json)) {
                errorStr = "Ты используешь не правильный формат ответа, попробуй ещё раз"
                throw new Error('Wrong answer format')
            }

            if(json != undefined) {
                json.forEach((command) => {
                    if(!validateCommand(command)) {
                        errorStr = "Ты используешь не правильный формат комманды, попробуй ещё раз"
                        throw new Error('Wrong command format')
                    }
                })
            } else {
                errorStr = "Ты используешь не правильный формат ответа, попробуй ещё раз"
                throw new Error('Wrong answer format')
            }

            return {res: json, status: true};
        } catch(e) {
            console.error(e);
            return {res: res, status: false, errorStr: errorStr};
        }
    }
    
    bot.behaviors.eventPool.send = async () => {
        bot.behaviors.eventPool.pending = true;

        let text = '['
        bot.behaviors.eventPool.pool.forEach(event => {
            text += JSON.stringify(event);
            text += ','
        });
        bot.behaviors.eventPool.pool = []
        if(text.endsWith(',')) {
            text = text.substring(0, text.length - 1);
        }
        text += ']'
        if(text == '[]') return;
        memory.push({
            'role': 'user',
            'text': text
        })
        
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
                'text': `[{"type":"event", "event_type":"answer_fail", "reason":"${sendResult.errorStr}"}]`
            });
            sendResult = await bot.behaviors.eventPool.sendToGpt(tmpMessages)
            if(nTry > maxTries && !sendResult.status)
                break;
        }

        if(!sendResult.status) {
            console.error('GPT Failed to answer');
            bot.chat('Sowwy! My gpt is faiwled ~')
        } else {
            memory.push({role: 'assistant', text: JSON.stringify(sendResult.res)})
            sendResult.res.forEach((command) => {
                runCommand(command);
            })
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