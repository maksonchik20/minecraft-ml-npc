const {attackPlayer, attackEntity} = require('./functions.js')
const { Movements } = require('mineflayer-pathfinder');
const { sayItems, equipItem, unequipItem, tossItem} = require('./inventory.js')
const { watchFurnace, watchChest, watchEnchantmentTable } = require('./chests')
const {collectBlocks, craftItem} = require("./digging");
const collectBlock = require('mineflayer-collectblock').plugin
const autotool = require('mineflayer-tool').plugin

function add(console, bot) {
    bot.on('spawn', async () => {
        await bot.waitForChunksToLoad()
        bot.loadPlugin(collectBlock)
        bot.loadPlugin(autotool)
        let defaultMove = new Movements(bot)
        bot.pathfinder.setMovements(defaultMove)
        let messages = bot.config.startPrompt
        let res = await bot.behaviors.gpt.ask(messages);
        bot.chat(res.result.alternatives[0].message.text)
    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        command = message.split(' ')
        console.log(message)
        switch (true) {
            case (message.includes('come with me') && (message.includes(bot.username) || bot.behaviors.looking.isInterestedIn(bot.players[username].entity))):
                console.log('start following ' + username)
                let target = bot.players[username]?.entity
                if(target !== undefined) {
                    bot.behaviors.follow.startFollowing(target)
                }
                break
            case (message.includes('stop following') && (message.includes(bot.username) || bot.behaviors.looking.isInterestedIn(bot.players[username].entity))):
                console.log('stop following')
                bot.behaviors.follow.stopFollowing()
                break
            case (message === 'attack me'):
                attackPlayer(bot, username)
                console.log('attacking me')
                break
            case (message === 'attack'):
                attackEntity(bot);
                console.log('attack someone')
                break
            case (message === 'say items'):
                sayItems(bot)
                break
            case (/^equip [\w-]+ \w+$/.test(message)):
                // example: equip hand diamond
                console.log(command)
                equipItem(bot, command[2], command[1])
                break
            case (/^unequip \w+$/.test(message)):
                // example: unequip hand
                unequipItem(bot, command[1])
                break
            case (/^toss \d+ \w+$/.test(message)):
                // example: toss 52 diamond
                tossItem(bot, command[2], command[1])
                break
            case (/^toss \w+$/.test(message)):
                // example: toss diamond
                tossItem(bot, command[1])
                break
            case (command[0] === 'craft'):
                // example: craft 1 crafting_table
                console.log('WHYX1')
                craftItem(bot, command[2], command[1])
                break
            case (command[0] === 'collect'):
                // example: collect 10 grass_block dirt
                console.log('WHYX2')
                collectBlocks(bot, command[2], command[1], command[3])
                break
            case /^chest$/.test(message):
                watchChest(bot, false, ['chest', 'ender_chest', 'trapped_chest'])
                bot.chat('Trying...')
                break
            case /^furnace$/.test(message):
                watchFurnace(bot)
                break
            case /^chestminecart$/.test(message):
                watchChest(bot, true)
                break
            case /^dispenser$/.test(message):
                watchChest(bot, false, ['dispenser'])
                break
            case /^enchant$/.test(message):
                watchEnchantmentTable(bot)
                break
        }
    })
}

module.exports = add