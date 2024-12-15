const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const fs = require('fs/promises');

let bot = undefined;

const RANGE_GOAL = 3

let targetPlayer = undefined;
let currentGoal = undefined
let defaultMove = undefined;

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

    bot.once('spawn', () => {
        defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)
    
        bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === 'come with me') {
                console.log('start following ' + username)
                targetPlayer = username;
                currentGoal = undefined
            }
            if (message === 'stop following me') {
                console.log('stop following ' + username)
                targetPlayer = undefined;
                currentGoal = undefined
            }
        })
    })
}

function goalDistance(a, b) {
    let dx = a.x - b.x
    let dy = a.y - b.y
    let dz = a.z - b.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

async function polling() {
    if(targetPlayer != undefined) {
        const target = bot.players[targetPlayer]?.entity
        console.log('following ' + targetPlayer)
        if (target != undefined) {
            const { x: playerX, y: playerY, z: playerZ } = target.position

            let goal = new GoalNear(playerX, playerY, playerZ, RANGE_GOAL)

            if(currentGoal == undefined) {
                bot.pathfinder.setGoal(goal)
                currentGoal = goal
            } else if (goalDistance(currentGoal, goal) > 2.0) {
                bot.pathfinder.setGoal(goal)
                currentGoal = goal
            }
        }
    }
}

startBot();
setInterval(polling, 50);