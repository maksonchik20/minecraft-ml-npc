const pathfinder = require('mineflayer-pathfinder')
function get_random_int (max){
    return Math.floor(Math.random() * max)
}
async function start_explore (bot)
{
    bot.pathfinder.setMovements(pathfinder.Movements())
    while (1)
        await bot.pathfinder.goals.goto(pathfinder.goals.GoalNearXZ(get_random_int(100), get_random_int(100), 5))
}

module.exports = start_explore;