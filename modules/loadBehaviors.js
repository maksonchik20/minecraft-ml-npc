const { createConsole } = require('./functions')

function add(console, bot) {
    bot.behaviors = {}

    require('./following')(createConsole(console, 'FollowingBehavior'), bot)
    require('./looking')(createConsole(console, 'LookingBehavior'), bot)
    require('./attacking')(createConsole(console, 'AttackingBehavior'), bot)
    require('./events')(createConsole(console, 'EventsBehavior'), bot)
    require('./gpt')(createConsole(console, 'GPT'), bot)
}

module.exports = add