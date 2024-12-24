const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
//const collect_block = require('mineflayer-collectblock').plugin;
//const auto_eat = require('mineflayer-auto-eat').loader;
const add_default_behaviors = require('./modules/loadBehaviors.js')
const fs = require('fs/promises');
const { createConsole } = require('./modules/functions.js');
let why = () => {console.log("oops")}
import('why-is-node-running').then((res) => {
    why = res.default
})

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

    bot.config = config;

    process.on('exit', async () => {
        bot.end('botClosed')
        why()
        await bot.behaviors.eventPool.writeHandle;
    })

    process.on('SIGINT', async () => {
        bot.end('botClosed')
        why()
        await bot.behaviors.eventPool.writeHandle;
    });

    process.on('SIGUSR1', async () => {
        bot.end('botClosed')
        why()
        await bot.behaviors.eventPool.writeHandle;
    });
    process.on('SIGUSR2', async () => {
        bot.end('botClosed')
        why()
        await bot.behaviors.eventPool.writeHandle;
    });

    process.stdin.on('data', (data) => {
        let inp = data.toString('utf8')  
        inp = inp.trim()

        switch (inp) {
            case 'forceClose':
                process.exit(0)
            default:
                break;
        }
    });

    bot.on('end', (res) => {
        console.error('bot ended because of ' + res)

        if(res == 'socketClosed')
            console.error('last sent packet ' + JSON.stringify(bot.endReason))

        if(res == 'botClosed')
            return

        createBot(config)
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp);

    bot.once('inject_allowed', () => {
        add_default_behaviors(createConsole(console, 'Default behaviors'), bot)

        config.additionalBehaviors.forEach(behaviorObj => {
            behaviorObj.behavior(createConsole(console, behaviorObj.name), bot)
        });
    })

    return bot
}

async function main() {

    console = createConsole(global.console, 'Bot')

    await startLogs();

    require('dotenv').config();

    root = process.env.CURRENT_BOT ? process.env.CURRENT_BOT : 'Default'
    const config = require(`./bots/${root}/settings.js`);
    bot = await createBot(config)
}

main()
