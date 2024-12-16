
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
function get_random_int (max){
    return Math.floor(Math.random() * max)
}
async function start_explore (console, bot)
{
    const defaultMovements = new Movements(bot)
    bot.pathfinder.setMovements(defaultMovements)
    while (1)
    {
        const goal = new goals.GoalNearXZ(get_random_int(100),get_random_int(100), 2)
        console.log(goal)
        console.log(bot.entity.position)
        try {
            await bot.pathfinder.goto(goal)
            console.log('reached goal')}
        catch(err) {console.log(err)}
    }
}

module.exports = start_explore;