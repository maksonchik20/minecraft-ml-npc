// const Ajv = require("ajv")
// const fs = require('fs/promises')
//
// async function add(console, bot) {
//
//     const ajv = new Ajv();
//
//     let gptTask = new Promise((resolve) => {
//         resolve('');
//     })
//
//     let idleCycles = 0
//     const maxIdleCycles = 10
//
//     bot.behaviors.eventPool = {}
//
//     bot.behaviors.eventPool.pending = false;
//
//     bot.behaviors.eventPool.pool = []
//     bot.behaviors.eventPool.reRun = false;
//
//     bot.behaviors.eventPool.addEvent = (event_type, event) => {
//         idleCycles = maxIdleCycles;
//         bot.behaviors.eventPool.pool.push(`[${event_type}] ${event}`)
//     }
//
//     let memory = []
//     memory = JSON.parse(await fs.readFile('./bots/Magus2/memory/history.json')).messages
//
//     bot.on('end', async () => {
//         bot.behaviors.eventPool.addEvent('Bot', 'You left the game')
//         await fs.writeFile('./bots/Magus2/memory/history.json', JSON.stringify({messages: memory}, null, 4));
//     })
//
//     bot.on('chat', (username, message) => {
//         if(username == bot.username) return;
//         bot.behaviors.eventPool.addEvent(`Chat`, `Player "${username}" send message "${message}"`);
//     })
//
//     let gptAnswer = (text='') => {
//         let lines = text.split('\n');
//         lines.forEach((text) => {
//             if((!(/^\[([A-Za-z0-9_]+)\] .+$/.test(text.trim()))) && (!(/^\[([A-Za-z0-9_]+)\]$/.test(text.trim())))) {
//                 throw new Error('Incorrect format of answer');
//             }
//         })
//     }
//
//     let commandSchemas = {
//         'FOLLOW': {
//             validator: (text='') => {
//                 if(text.split(/[\t\n\r ]+/).length != 2)
//                     return false;
//                 return true;
//             },
//             execute: (args) => {
//                 console.log(`Follow not supported yet!`)
//                 bot.behaviors.eventPool.addEvent('Command', '"FOLLOW" successfully completed, this is a command result, you can ignore this message');
//             }
//         },
//         'STOP_FOLLOW': {
//             validator: (text='') => {
//                 if(text.split(/[\t\n\r ]+/).length != 2)
//                     return false;
//                 return true;
//             },
//             execute: (args) => {
//                 console.log(`Stop_follow not supported yet!`)
//                 bot.behaviors.eventPool.addEvent('Command', '"STOP_FOLLOW" successfully completed, this is a command result, you can ignore this message');
//             }
//         },
//         'CHAT': {
//             validator: (text='') => {
//                 if(text.split(/[\t\n\r ]+/).length < 2)
//                     return false;
//                 return true;
//             },
//             execute: (text) => {
//                 bot.chat(text)
//                 bot.behaviors.eventPool.addEvent('Command', '"CHAT" successfully completed, this is a command result, you can ignore this message');
//             }
//         },
//         'REASONING': {
//             validator: (text='') => {
//                 if(text.split(/[\t\n\r ]+/).length < 2)
//                     return false;
//                 return true;
//             },
//             execute: () => {
//                 bot.behaviors.eventPool.reRun = true;
//             }
//         },
//         'STOP': {
//             validator: (text='') => {
//                 return true;
//             },
//             execute: () => {
//                 bot.behaviors.eventPool.reRun = false;
//                 // stop!
//             }
//         }
//     }
//
//     function validateCommand(text) {
//         let command_type = /^\[([A-Za-z0-9_]+)\].*$/.exec(text.trim())
//         if(command_type.length < 2)
//             throw new Error(`Command "${obj.command_type}" is in incorrect format, try again`)
//         command_type = command_type[1];
//         if(commandSchemas[command_type] == undefined) {
//             throw new Error(`Command "${command_type}" does not exists, try again`)
//         }
//         result = commandSchemas[command_type].validator(text.trim())
//         if(!result) {
//             throw new Error(`Command "${command_type}" is in incorrect format, try again`)
//         }
//     }
//
//     function runCommand(text) {
//         let command_type = /^\[([A-Za-z0-9_]+)\](.*)$/.exec(text.trim())
//         let commandArgs = command_type.length > 1 ? command_type[2].trim() : undefined;
//         command_type = command_type[1];
//         commandSchemas[command_type].execute(commandArgs)
//     }
//
//     bot.behaviors.eventPool.sendToGpt = async (messages) => {
//         let res = (await bot.behaviors.gpt.ask(messages)).result.alternatives[0].message.text;
//         if(res.startsWith('```')) {
//             res = res.substring(3, res.length);
//         }
//         if(res.endsWith('```')) {
//             res = res.substring(0, res.length - 3);
//         }
//
//         try {
//             gptAnswer(res)
//
//             let cmds = res.split('\n');
//
//             if(res != undefined) {
//                 cmds.forEach((cmd) => {
//                     validateCommand(cmd)
//                 })
//             } else {
//                 throw new Error('You are using incorrect format of answer. try again')
//             }
//
//             return {res: res, status: true};
//         } catch(e) {
//             console.error(e);
//             return {res: res, status: false, errorStr: e};
//         }
//     }
//
//     bot.behaviors.eventPool.send = async () => {
//         bot.behaviors.eventPool.pending = true;
//
//         let text = ''
//         bot.behaviors.eventPool.pool.forEach(event => {
//             text += event;
//             text += '\n'
//         });
//         bot.behaviors.eventPool.pool = []
//         if(text !== '') {
//             memory.push({
//                 'role': 'user',
//                 'text': text
//             })
//         }
//
//         let messages = bot.config.startPrompt;
//         memory.forEach(message => {
//             messages.push(message)
//         });
//
//         let sendResult = await bot.behaviors.eventPool.sendToGpt(messages)
//
//         let nTry = 1;
//         const maxTries = 5;
//
//         while(!sendResult.status) {
//             nTry++;
//             let tmpMessages = messages;
//             tmpMessages.push({
//                 'role': 'assistant',
//                 'text': sendResult.res
//             });
//             tmpMessages.push({
//                 'role': 'user',
//                 'text': `[Wrong answer]: ${sendResult.errorStr}`
//             });
//             sendResult = await bot.behaviors.eventPool.sendToGpt(tmpMessages)
//             if(nTry > maxTries && !sendResult.status)
//                 break;
//         }
//
//         if(!sendResult.status) {
//             console.error('GPT Failed to answer');
//             bot.chat('Sowwy! My gpt is faiwled ~')
//         } else {
//             memory.push({role: 'assistant', text: (typeof sendResult.res == 'string') ? sendResult.res : JSON.stringify(sendResult.res)})
//             commands = sendResult.res.split('\n');
//             commands.forEach((cmd) => {
//                 runCommand(cmd)
//             })
//         }
//
//         if(bot.behaviors.eventPool.reRun) {
//             bot.behaviors.eventPool.reRun = false;
//             gptTask = bot.behaviors.eventPool.send()
//         }
//
//         bot.behaviors.eventPool.pending = false;
//     }
//
//     let idleTask = setInterval(() => {
//         if(idleCycles > 0) {
//             idleCycles--;
//         }
//         if(idleCycles == 0 && bot.behaviors.eventPool.pool.length != 0 && !bot.behaviors.eventPool.pending) {
//             gptTask = bot.behaviors.eventPool.send()
//         }
//     }, 50)
//
//     bot.on('end', () => {
//         clearInterval(idleTask)
//     })
// }
//
// module.exports = add