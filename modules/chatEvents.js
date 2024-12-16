const {attackPlayer, attackEntity} = require('./functions.js')
const { Movements } = require('mineflayer-pathfinder');
const { sayItems, equipItem, unequipItem, tossItem, craftItem} = require('./inventory.js')

function add(bot) {
    bot.on('spawn', async () => {
        let defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)
    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        const command = message.split(' ')
        if (message.includes('come with me') && (message.includes(bot.username) || bot.behaviors.looking.isInterestedIn(bot.players[username].entity))) {
            console.log('start following ' + username)
            let target = bot.players[username]?.entity
            if(target !== undefined) {
                bot.chat('Following you!')
                bot.behaviors.follow.startFollowing(target)
            }
        }
        if (message.includes('stop following') && (message.includes(bot.username) || bot.behaviors.looking.isInterestedIn(bot.players[username].entity))) {
            console.log('stop following')
            bot.chat('Ok');
            bot.behaviors.follow.stopFollowing()
        }
        if (message === 'attack me') {
            attackPlayer(bot, username)
            console.log('attacking me')
        }
        else if (message === 'attack') {
            attackEntity(bot);
            console.log('attack someone')
        }
        if (message === 'say items') {
            sayItems(bot)
        }
        if (/^equip [\w-]+ \w+$/.test(message)) {
            // example: equip hand diamond
            equipItem(bot, command[2], command[1])
        }
        if (/^unequip \w+$/.test(message)) {
            // example: unequip hand
            unequipItem(bot, command[1])
        }
        if (/^toss \d+ \w+$/.test(message)) {
            // example: toss 52 diamond
            tossItem(bot, command[2], command[1])
        }
        if (/^toss \w+$/.test(message)) {
            tossItem(bot, command[1])
        }
    })
}

module.exports = add