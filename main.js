const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const behaviors = require('./modules/loadBehaviors.js')
const {attackPlayer, attackEntity} = require('./modules/functions.js')
const { sayItems, equipItem, unequipItem, tossItem, craftItem} = require('./modules/inventory')
const fs = require('fs/promises');

let bot = undefined;

async function createBot() {
    let date = new Date();
    let logFileName = `logs/log_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()} ${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.txt`;

    let logs = await (await fs.open(logFileName, 'w')).createWriteStream();

    console.log('Starting logs')

    process.stdout.write = process.stderr.write = logs.write.bind(logs)

    process.on('uncaughtException', function(err) {
        console.error((err && err.stack) ? err.stack : err);
    });

    require('dotenv').config();

    bot = mineflayer.createBot({
        host: process.env.HOST ? process.env.HOST : '10.82.95.41',
        port: process.env.PORT ? process.env.PORT : 25565,
        username: process.env.BOT_USERNAME ? process.env.BOT_USERNAME : 'SomeBot'
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(behaviors);


    bot.on('spawn', async () => {
        let defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)
    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        const command = message.split(' ')
        if (message === 'come with me') {
            console.log('start following ' + username)
            let target = bot.players[username]?.entity
            if(target !== undefined)
                bot.behaviors.follow.startFollowing(target)
        }
        if (message === 'stop following') {
            console.log('stop following')
            bot.behaviors.follow.stopFollowing()
        }
        if (message === 'attack me') {
            attackPlayer(bot, username)
            console.log('attacking me')
        }
        else if (message === 'attack') {
            attackEntity(bot);
            console.log('attack someone')
        }
        if (message === 'say items') {
            sayItems(bot)
        }
        if (/^equip [\w-]+ \w+$/.test(message)) {
            // example: equip hand diamond
            equipItem(bot, command[2], command[1])
        }
        if (/^unequip \w+$/.test(message)) {
            // example: unequip hand
            unequipItem(bot, command[1])
        }
        if (/^toss \d+ \w+$/.test(message)) {
            // example: toss 52 diamond
            tossItem(bot, command[2], command[1])
        }
        if (/^toss \w+$/.test(message)) {
            tossItem(bot, command[1])
        }
    })

    bot.on('')
}



startBot();