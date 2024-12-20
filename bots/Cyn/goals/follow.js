module.exports = {
    paused: true,
    priority: (bot, goal) => {
        if(goal.lost)
            return 5;
        return 90;
    },
    execute: (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
        bot.behaviors.follow.startFollowing(goal.target);
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
        if(bot.behaviors.follow.target.username == goal.target.username)
            bot.behaviors.follow.stopFollowing();
    },
    target: undefined,
    lost: false
}