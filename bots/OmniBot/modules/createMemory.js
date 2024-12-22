const fs = require('fs');
const { Movements } = require('mineflayer-pathfinder');

function add(console, bot) {
    try {
        fs.accessSync(`./bots/${bot.config.settings.username}/memory/history.json`, fs.constants.W_OK, fs.constants.R_OK)
    } catch {
        try {
            fs.mkdirSync(`./bots/${bot.config.settings.username}/memory`);
            fs.writeFileSync(`./bots/${bot.config.settings.username}/memory/history.json`, JSON.stringify({
                messages: []
            }, null, 4))
        } catch {
            console.log('Failed to create memory, here be dragons!');
        }
    }

    bot.behaviors.guard = {}
    bot.behaviors.eventPool = {}
    bot.behaviors.interest = {}
    bot.behaviors.goals = {}

    bot.pathfinder.setMovements(new Movements(bot))
}

module.exports = add