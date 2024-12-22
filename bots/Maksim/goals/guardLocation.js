const {guardArea, stopGuarding} = require('../guard')

module.exports = {
    paused: true,
    priority: (bot, goal) => {
        if(bot.players[goal.username].entity == null)
            return 5;
        if(bot.distanceTo(bot.players[goal.username].entity.position) > 10.0)
            return 5;
        return 95;
    },
    execute: (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
        guardArea(bot, goal.username, false)
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
        if(bot.protect_user == goal.username)
            stopGuarding(bot)
    },
    username: '',
}