const vec3 = require('vec3')
const mineflayer = require("mineflayer")
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
function get_random_int (max){
    return Math.floor(Math.random() * max - max)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function show_location(bot)
{
    while (1)
    {
        console.log(bot.entity.position)
        await sleep(5000)
    }
}
async function go_to_random_point(bot, radius)
{
    const pos = bot.entity.position
    const goal = new goals.GoalNearXZ(pos.x + get_random_int(radius), pos.z + get_random_int(radius), 5)
    console.log(goal)
    try
    {
        await bot.pathfinder.goto(goal)
        console.log('reached goal')
    }
    catch(err)
    {
        console.log(err)
    }

}
async function start_explore (bot)
{
    const defaultMovements = new Movements(bot)
    bot.pathfinder.setMovements(defaultMovements)
    show_location(bot)
    while (1)
        await go_to_random_point(bot, 100)
}

const bot = mineflayer.createBot(
    {   host: '10.82.28.224',
        port: 25565,
        username: 'amebka'}
)
bot.on('kicked', console.log)
bot.on('error', console.log)
bot.once('spawn', async () => {bot.loadPlugin(pathfinder)
    mineflayerViewer(bot, {host:3000, firstPerson:false})
    console.log(bot.entity.position)
        await bot.waitForChunksToLoad()
        start_explore(bot)
})
