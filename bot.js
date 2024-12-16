const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const behaviors = require('./modules/loadBehaviors.js')

const fs = require('fs/promises');

let bot = undefined;

async function createBot(config) {

    bot = mineflayer.createBot(config.settings)

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(behaviors)

    config.additionalBehaviors.forEach(behavior => {
        behavior(bot)
    });

    return bot
}

async function main() {
    let date = new Date();
    let logFileName = `logs/log_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()} ${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.txt`;

    let logs = await (await fs.open(logFileName, 'w')).createWriteStream();

    console.log('Starting logs')

    process.stdout.write = process.stderr.write = logs.write.bind(logs)

    process.on('uncaughtException', function(err) {
        console.error((err && err.stack) ? err.stack : err);
    });

    require('dotenv').config();

    root = process.env.CURRENT_BOT ? process.env.CURRENT_BOT : 'Default'
    const config = require(`./bots/${root}/settings.js`);
    bot = await createBot(config)

    bot.on('end', (reason) => {
        //TODO: make it reconnect!
    })
}

main()