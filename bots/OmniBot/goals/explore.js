
module.exports = {
    paused: true,
    priority: (bot, goal) => {
        return 6;
    },
    execute: (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
        bot.behaviors.explore.go_to_random_point(50);
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
    }
}