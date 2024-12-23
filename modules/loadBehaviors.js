const { createConsole } = require('./functions')

function add(console, bot) {
    bot.behaviors = {}

    bot.behaviors.walking = 0
    bot.behaviors.fighting = 0
    bot.behaviors.mining = 0

    require('./following')(createConsole(console, 'FollowingBehavior'), bot)
    require('./looking')(createConsole(console, 'LookingBehavior'), bot)
    require('./attacking')(createConsole(console, 'AttackingBehavior'), bot)
    require('./events')(createConsole(console, 'EventsBehavior'), bot)
    require('./gpt')(createConsole(console, 'GPT'), bot)
}

module.exports = add