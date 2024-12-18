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
    
    bot.behaviors.eventPool.callbackPool = []
    bot.behaviors.eventPool.pool = []
    
    bot.behaviors.eventPool.addEvent = (event) => {
        idleCycles = maxIdleCycles;
        bot.behaviors.eventPool.pool.push(event)
    }

    bot.behaviors.eventPool.addCallbackEvent = (name, result) => {
        idleCycles = maxIdleCycles;
        bot.behaviors.eventPool.callbackPool.push({'functionResult': {'name': name, 'content': result}})
    }

    let memory = []
    memory = JSON.parse(await fs.readFile('./bots/Cyn/memory/history.json')).messages

    bot.on('end', async () => {
        bot.behaviors.eventPool.addEvent(`[Событие]: Бот покинул сервер"`)
        await fs.writeFile('./bots/Cyn/memory/history.json', JSON.stringify({messages: memory}, null, 4));
    })

    bot.on('chat', (username, message) => {
        if(username == bot.username) return;
        bot.behaviors.eventPool.addEvent(`[Событие]: Игрок "${username}" написал "${message}"`);
    })

    let gptAnswer = require('./schemas/gptAnswer')

    let commandSchemas = {
        'follow': require('./schemas/command/follow'),
        'stop_follow': require('./schemas/command/stop_follow'),
        'chat': require('./schemas/command/chat'),
        'stop_function': require('./schemas/command/stop_function')
    }

    let tools = []; 
    Object.values(commandSchemas).forEach((schema) => {
        if(schema.tool)
            tools.push(schema.tool)
    })
    
    let eventSchemas = {
        'chat': require('./schemas/event/chat'),
        'player_joined': require('./schemas/event/player_joined'),
        'player_left': require('./schemas/event/player_left'),
        'bot_joined': require('./schemas/event/bot_joined'),
        'bot_left': require('./schemas/event/bot_left')
    }

    function validateCommand(obj) {
        if(commandSchemas[obj.functionCall.name] == undefined) {
            console.error(JSON.stringify(obj))
            throw new Error(`Команда ${obj.functionCall.name} не найдена, используй лишь данные тебе функции`)
        }
        if(commandSchemas[obj.functionCall.name].validator == undefined) {
            console.log(`Validator for ${obj.functionCall.name} not implemented yet`)
            return true
        }
        result = commandSchemas[obj.functionCall.name].validator(obj.functionCall)
        if(!result) {
            console.error(`Wrong format of command ${obj.functionCall.name}, ${JSON.stringify(obj.functionCall)}`)
            return false;
        }
        return true;
    }

    function validateEvent(obj) {
        if(eventSchemas[obj.event_type] == undefined) {
            console.log(`Event not found ${obj.event_type}`)
            return false;
        }
        result = eventSchemas[obj.event_type](obj)
        if(!result) {
            console.error(`Wrong format of command ${obj.event_type}, ${JSON.stringify(obj)}`)
            return false;
        }
        return true;
    }

    function runCommand(obj) {
        switch (obj.functionCall.name) {
            case 'chat':
                bot.chat(obj.functionCall.arguments.message)
                bot.behaviors.eventPool.addCallbackEvent('chat', 'Ты отправил сообщение');
                break;
            case 'stop_function':
                //bot.behaviors.eventPool.addCallbackEvent('stop_function', 'Ты приостановил выполнение, ожидай следующих событий');
                break;
            default:
                bot.behaviors.eventPool.addCallbackEvent(obj.functionCall.name, `Функция ${obj.functionCall.name} ещё не поддерживается`);
                console.log(`Not supported yet ${obj.functionCall.name}`)
                break;
        }
    }

    bot.behaviors.eventPool.collapseMemory = async() => {
        
    }

    bot.behaviors.eventPool.sendToGpt = async (messages) => {
        let errorStr = "Ты используешь не правильный формат ответа, попробуй ещё раз"
        let res = (await bot.behaviors.gpt.ask(messages, tools)).result.alternatives[0].message;
        
        if(res.text) {
            errorStr = "Ты можешь использовать только функции, попробуй ещё раз";
            console.error(errorStr);
            return {res: res, status: false, errorStr: errorStr};
        }
        if(res.toolCallList == undefined) {
            errorStr = "Ты не использовал список функций (Он должен быть, даже если пуст), попробуй ещё раз"
            console.error(errorStr);
            return {res: res, status: false, errorStr: errorStr};
        }
        if(res.toolCallList.toolCalls == undefined) {
            errorStr = "Ты не использовал список функций (Он должен быть, даже если пуст), попробуй ещё раз"
            console.error(errorStr);
            return {res: res, status: false, errorStr: errorStr};
        }

        try {
            let json = res.toolCallList.toolCalls;

            if(!gptAnswer(json)) {
                throw new Error('Ты используешь не правильный формат ответа, попробуй ещё раз')
            }

            if(json != undefined) {
                json.forEach((command) => {
                    if(!validateCommand(command)) {
                        throw new Error('Ты используешь не правильный формат функции, попробуй ещё раз')
                    }
                })
            } else {
                throw new Error('Ты используешь не правильный формат ответа, попробуй ещё раз')
            }

            return {res: json, status: true};
        } catch(e) {
            console.error(e);
            return {res: res, status: false, errorStr: e.toString()};
        }
    }
    
    bot.behaviors.eventPool.send = async () => {
        bot.behaviors.eventPool.pending = true;

        if(bot.behaviors.eventPool.callbackPool.length != 0) {
            msg = {
                'role': 'user',
                'toolResultList': {
                    'toolResults': []
                }
            }

            bot.behaviors.eventPool.callbackPool.forEach((result) => {
                msg.toolResultList.toolResults.push(result);
            })

            bot.behaviors.eventPool.callbackPool = []

            memory.push(msg)
        }

        if(bot.behaviors.eventPool.pool.length != 0) {
            let text = ""

            bot.behaviors.eventPool.pool.forEach(event => {
                text += event;
                text += '\n'
            });
            bot.behaviors.eventPool.pool = []
            if(text.endsWith('\n')) {
                text = text.substring(0, text.length - 1);
            }
            if(text.length == 0) return;
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
            tmpMessages.push(sendResult.res);
            tmpMessages.push({
                'role': 'user',
                'text': sendResult.errorStr
            });
            sendResult = await bot.behaviors.eventPool.sendToGpt(tmpMessages)
            if(nTry > maxTries && !sendResult.status)
                break;
        }

        if(!sendResult.status) {
            console.error('GPT Failed to answer');
            bot.chat('Sowwy! My gpt is faiwled ~')
        } else {
            memory.push({role: 'assistant', toolCallList: {toolCalls: sendResult.res}})

            await bot.behaviors.eventPool.collapseMemory();

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
        if(idleCycles == 0 && (bot.behaviors.eventPool.pool.length != 0 || bot.behaviors.eventPool.callbackPool.length != 0) && !bot.behaviors.eventPool.pending) {
            gptTask = bot.behaviors.eventPool.send()
        }
    }, 50)

    bot.on('end', () => {
        clearInterval(idleTask)
    })
}

module.exports = add