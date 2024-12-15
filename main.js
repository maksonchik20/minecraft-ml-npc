const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const behaviors = require('./modules/basic.js')
const fs = require('fs/promises');

let bot = undefined;

async function startBot() {
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
        host: process.env.HOST ? process.env.HOST : 'localhost',
        port: process.env.PORT ? process.env.PORT : 25565,
        username: process.env.BOT_USERNAME ? process.env.BOT_USERNAME : 'JSBot'
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(behaviors);

    bot.once('spawn', () => {
        let defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)
    
        bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === 'come with me') {
                console.log('start following ' + username)
                let target = bot.players[username]?.entity
                if(target != undefined)
                    bot.behaviors.follow.startFollowing(target)
            }
            if (message === 'stop following') {
                console.log('stop following')
                bot.behaviors.follow.stopFollowing()
            }
        })
    })
}



startBot();