const { collectBlocks } = require('../../../modules/digging')

module.exports = {
    paused: true,
    priority: (bot, goal) => {
        return 10;
    },
    execute: async (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
        await collectBlocks(bot, goal.block, goal.amount)
        this.priority = (bot, goal) => {
            return -1;
        }
        this.priority.bind(this)
        goal.paused = true;
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
    }
}