const {tossItem} = require("./inventory");
// const collectBlock = require('mineflayer-collectblock').plugin
// const autotool = require('mineflayer-tool').plugin
const Recipe = require('prismarine-recipe')("1.20.1").Recipe
const { Movements, goals } = require('mineflayer-pathfinder')

async function collectBlocks(bot, block, amount=1, block_result=null) {
    const blockType = bot.registry.blocksByName[block]
    // const blockType = mcData.blocksByName[block]
    console.log(blockType)
    for (let count = 0; count < amount; count++) {
        const block_needed = bot.findBlock({
            matching: blockType.id,
        })
        if (block_needed) {
            try {
                console.log('Trying to break 1 block')
                await bot.collectBlock.collect(block_needed)
                console.log('1 block breaked')
            } catch (err) {
                console.log(err)
            }
        }
    }
    bot.chat('Work done! I guess...')
    if (block_result) {
        tossItem(bot, block_result, amount)
    }
}

async function craftItem(bot, item, amount) {
    amount = parseInt(amount, 10)
    const itemType = bot.registry.itemsByName[item]
    const recipe = Recipe.find(itemType.id)[0]
    if (recipe && item) {
        if (recipe.requiresTable) {
            const craftingTableID = bot.registry.blocksByName.crafting_table.id
            const craftingTable = bot.findBlock({
                matching: craftingTableID
            })
            bot.chat('Oh, I need a crafting table!')
            if (!craftingTable) {
                bot.chat(`Cannot find crafting table :(`)
            }
            else {
                bot.pathfinder.setMovements(new Movements(bot))
                await bot.pathfinder.goto(new goals.GoalNear(craftingTable.position.x, craftingTable.position.y, craftingTable.position.z, 3))
                try {
                    await bot.craft(recipe, amount, craftingTable)
                    bot.chat(`Crafted ${item} ${amount} times on crafting table`)
                } catch (err) {
                    console.log(err)
                    bot.chat(`Error crafting ${item} on crafting_table`)
                }
            }
        } else {
            bot.chat(`I can craft it without crafting table!`)
            try {
                await bot.craft(recipe, amount)
                bot.chat(`Crafted ${item} ${amount} times`)
            } catch (err) {
                console.log(err)
                bot.chat(`Error crafting ${item}`)
            }
        }
    }
    else {
        if (item) {
            bot.chat(`There's no ${item} exists`)
        }
        else {
            bot.chat(`There's no recipe for ${item}`)
        }
    }
}


// function add(console, bot) {
//
//     bot.on('spawn', async () => {
//         await bot.waitForChunksToLoad()
//         bot.loadPlugin(collectBlock)
//         bot.loadPlugin(autotool)
//         let messages = [
//             {
//                 role: 'system',
//                 text: bot.config.startPrompt
//             }
//         ]
//         let res = await bot.behaviors.gpt.ask(messages);
//         bot.chat(res.result.alternatives[0].message.text)
//         bot.chat('Hi everyone, ready to work!')
//         collectBlocks(bot, "grass_block", 4, 'dirt')
//     })
//
//     bot.on('chat', (username, message) => {
//         command = message.split(' ')
//         if (command[0] === 'collect') {
//             // example: collect 10 grass_block
//             collectBlocks(bot, command[2], command[1], command[3])
//         }
//         if (command[0] === 'craft') {
//             // example: craft 1 crafting_table
//             craftItem(bot, command[2], command[1])
//         }
//     })
// }

module.exports = {
    collectBlocks: collectBlocks,
    craftItem: craftItem
}