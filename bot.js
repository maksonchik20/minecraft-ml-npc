const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const behaviors = require('./modules/loadBehaviors.js')
const fs = require('fs/promises');
const { createConsole } = require('./modules/functions.js');

let bot = undefined;
let console = undefined;

async function startLogs() {
    let date = new Date();
    let logFileName = `logs/log_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()} ${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.txt`;

    let logs = await (await fs.open(logFileName, 'w')).createWriteStream();

    console.log('Starting logs')

    process.stdout.write = process.stderr.write = logs.write.bind(logs)

    process.on('uncaughtException', function(err) {
        console.error((err && err.stack) ? err.stack : err);
    });
}

async function createBot(config) {
    
    bot = mineflayer.createBot(config.settings)

    bot.on('end', (res) => {
        console.error('bot ended because of ' + res)
        
        if(res == 'socketClosed')
            console.error('last sent packet ' + JSON.stringify(bot.endReason))

        createBot(config)
    })

    bot.loadPlugin(pathfinder)

    bot.once('inject_allowed', () => {
        behaviors(createConsole(console, 'Default behaviors'), bot)

        config.additionalBehaviors.forEach(behaviorObj => {
            behaviorObj.behavior(createConsole(console, behaviorObj.name), bot)
        });
    })

    return bot
}

async function main() {

    console = createConsole(global.console, 'Magus2')

    await startLogs();

    require('dotenv').config();

    root = process.env.CURRENT_BOT ? process.env.CURRENT_BOT : 'Default'
    const config = require(`./bots/${root}/settings.js`);
    bot = await createBot(config)
}

main()
