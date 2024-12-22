module.exports = {
    paused: true,
    priority: (bot, goal) => {
        return 5;
    },
    execute: (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
    }
}