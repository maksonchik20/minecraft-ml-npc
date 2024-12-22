function get_random_int (max){
    return Math.floor(Math.random() * max - max)
}
async function add_behavior(console, bot) {
    bot.behaviors.explore = {}
    bot.behaviors.explore.go_to_random_point =async (radius) =>
    {
        const pos = bot.entity.position
        const goal = new goals.GoalNearXZ(pos.x + get_random_int(radius), pos.z + get_random_int(radius), 5)
        console.log(goal)
        try
        {
            await bot.pathfinder.goto(goal)
            console.log('reached point')
        }
        catch(err)
        {
            console.log(err)
        }
    }
}
module.exports = add_behavior