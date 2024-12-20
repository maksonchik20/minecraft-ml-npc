const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
function get_random_int (max){
    return Math.floor(Math.random() * max - max)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function show_location(console, bot)
{
    while (1)
    {
        console.log(bot.entity.position)
        await sleep(5000)
    }
}
async function go_to_random_point(console, bot, radius)
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
async function explore (console, bot)
{
    const defaultMovements = new Movements(bot)
    bot.pathfinder.setMovements(defaultMovements)
    show_location(console, bot)
    while (1)
        await go_to_random_point(console, bot, 100)
}
async function start_explore(console, bot) 
{
    bot.once('spawn', () => {explore(console, bot)})
}
module.exports = start_explore;
