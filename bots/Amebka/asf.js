
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
async function start_explore (bot)
{
    
    
    const defaultMovements = new Movements(bot)
    bot.pathfinder.setMovements(defaultMovements)
    show_location(bot)
    const goal = new goals.GoalNearXZ(400, 60, 4)
    await bot.pathfinder.goto(goal)
    while (0)
    {
        const goal = new goals.GoalNearXZ(get_random_int(100),get_random_int(100), 1)
        console.log(goal)
        const d = bot.players
        for (const val of Object.values(d)){console.log(val)}    
        try 
            {await bot.pathfinder.goto(goal)}
        catch{console.log('error')}
        console.log('h')
    }
}

const bot = mineflayer.createBot(
    {   host: '10.82.95.41',
        port: 25565,
        username: 'amebka'}
)
bot.on('kicked', console.log)
bot.on('error', console.log)
bot.once('spawn', () => {bot.loadPlugin(pathfinder)
    mineflayerViewer(bot, {host:3000, firstPerson:false})
    start_explore(bot)
})