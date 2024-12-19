const mineflayer = require('mineflayer')
const { itemToString, sayItems } = require('../../modules/inventory')
// const {} = require("../../modules/inventory");

function add(console, bot) {
    bot.on('experience', () => {
        bot.chat(`I am level ${bot.experience.level}`)
    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        switch (true) {
            case /^chest$/.test(message):
                watchChest(bot, false, ['chest', 'ender_chest', 'trapped_chest'])
                bot.chat('Trying...')
                break
            case /^list$/.test(message):
                sayItems(bot)
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

async function watchChest(bot, minecart, blocks=[]) {
    let chestToOpen
    if (minecart) {
        console.log(Object.keys(bot.entities).map(id => bot.entities[id]))
        console.log(bot.registry.entitiesByName.chest_minecart)
        chestToOpen = Object.keys(bot.entities)
        .map(id => bot.entities[id]).find(e => e.entityType === bot.registry.entitiesByName.chest_minecart.id && bot.entity.position.distanceTo(e.position) <= 6)
        if (!chestToOpen) {
            bot.chat(`No chest minecart found`)
            return
        }
    } else {
        chestToOpen = bot.findBlock({
            matching: blocks.map(name => bot.registry.blocksByName[name].id),
            maxDistance: 6
        })
        if (!chestToOpen) {
            bot.chat(`No chest found`)
            return
        }
    }
    const chest = await bot.openContainer(chestToOpen)
    sayItems(bot, chest.containerItems())
    chest.on('updateSlot', (slot, oldItem, newItem) => {
        bot.chat(`Chest update: ${itemToString(oldItem)} -> ${itemToString(newItem)} (slot: ${slot})`)
    })

    chest.on('close', () => {
        bot.chat(`Chest closed`)
    })

    bot.on('chat', onChat)

    function onChat (username, message) {
        if (username === bot.username) return
        const command = message.split(' ')
        switch (true) {
            case /^close$/.test(message):
                closeChest()
                break
            case /^withdraw \d+ \w+$/.test(message):
                // withdraw amount name
                // example: withdraw 16 stick
                withdrawItem(command[2], command[1])
                break
            case /^deposit \d+ \w+$/.test(message):
                // deposit amount name
                // example: deposit 16 stick
                depositItem(command[2], command[1])
                break
        }
    }

    function closeChest () {
        chest.close()
        bot.removeListener('chat', onChat)
    }

    async function withdrawItem (name, amount) {
        const item = itemByName(chest.containerItems(), name)
        if (item) {
            try {
                await chest.withdraw(item.type, null, amount)
                bot.chat(`Withdrew ${amount} ${item.name}`)
            } catch (err) {
                bot.chat(`Unable to withdraw ${amount} ${item.name}`)
            }
        } else {
            bot.chat(`Unknown item ${name}`)
        }
    }

    async function depositItem (name, amount) {
        const item = itemByName(chest.items(), name)
        if (item) {
            try {
                await chest.deposit(item.type, null, amount)
                bot.chat(`Deposited ${amount} ${item.name}`)
            } catch (err) {
                bot.chat(`Unable to deposit ${amount} ${item.name}`)
            }
        } else {
            bot.chat(`Unknown item ${name}`)
        }
    }
}

async function watchFurnace(bot) {
    const furnace_block = bot.findBlock({
        matching: [`furnace`, `blast_furnace`].filter(name => bot.registry.blocksByName[name] !== undefined).map(name => bot.registry.blocksByName[name].id),
        maxDistance: 6
    })
    if (!furnace_block) {
        bot.chat('No furnace found')
        return
    }
    const furnace = await bot.openFurnace(furnace_block)
    let output = ''
    output += `Input: ${itemToString(furnace.inputItem())}, `
    output += `Fuel: ${itemToString(furnace.fuelItem())}, `
    output += `Output: ${itemToString(furnace.outputItem())}`
    bot.chat(output)

    furnace.on(`updateSlot`, (slot, oldItem, newItem) => {
        if (slot === 2 && itemToString(newItem) !== 'nothing') {
        }
        bot.chat(`Furnace update: ${itemToString(oldItem)} -> ${itemToString(newItem)} (slot: ${slot})`)
    })

    furnace.on(`close`, () => {
        bot.chat(`Furnace closed`)
    })

    // furnace.on(`update`, () => {
    //     console.log(`Fuel: ${Math.round(furnace.fuel * 100)}% Progress: ${Math.round(furnace.progress * 100)}%`)
    // })

    bot.on('chat', onChat)

    function onChat (username, message) {
        if (username === bot.username) return
        const command = message.split(' ')
        switch (true) {
            case /^close$/.test(message):
                closeFurnace()
                break
        case /^(input|fuel) \d+ \w+$/.test(message):
            // input amount name
            // example: input 32 coal
            putInFurnace(command[0], command[2], command[1])
            break
        case /^take (input|fuel|output)$/.test(message):
            // take what
            // example: take output
            takeFromFurnace(command[1])
            break
        }

        function closeFurnace () {
            furnace.close()
            bot.removeListener('chat', onChat)
        }

        async function putInFurnace (where, name, amount) {
            const item = itemByName(furnace.items(), name)
            if (item) {
                const fn = {
                    input: furnace.putInput,
                    fuel: furnace.putFuel
                }[where]
                try {
                    await fn.call(furnace, item.type, null, amount)
                    bot.chat(`Put ${amount} ${item.name}`)
                } catch (err) {
                    bot.chat(`Unable to put ${amount} ${item.name}`)
                }
            } else {
                bot.chat(`Unknown item ${name}`)
            }
        }

        async function takeFromFurnace (what) {
            const fn = {
                input: furnace.takeInput,
                fuel: furnace.takeFuel,
                output: furnace.takeOutput
            }[what]
            try {
                console.log(fn)
                const item = await fn.call(furnace)
                bot.chat(`Took ${item.name}`)
            } catch (err) {
                bot.chat('Unable to take')
            }
        }
    }
}

async function watchEnchantmentTable (bot) {
    const enchantTableBlock = bot.findBlock({
        matching: ['enchanting_table'].map(name => bot.registry.blocksByName[name].id),
        maxDistance: 6
    })
    if (!enchantTableBlock) {
        bot.chat('no enchantment table found')
        return
    }
    const table = await bot.openEnchantmentTable(enchantTableBlock)
    bot.chat(itemToString(table.targetItem()))

    table.on('updateSlot', (slot, oldItem, newItem) => {
        bot.chat(`enchantment table update: ${itemToString(oldItem)} -> ${itemToString(newItem)} (slot: ${slot})`)
    })
    table.on('close', () => {
        bot.chat('enchantment table closed')
    })
    table.on('ready', () => {
        bot.chat(`ready to enchant. choices are ${table.enchantments.map(o => o.level).join(', ')}`)
    })

    bot.on('chat', onChat)


    function onChat (username, message) {
        if (username === bot.username) return
        const command = message.split(' ')
        switch (true) {
            case /^close$/.test(message):
                closeEnchantmentTable()

                break
            case /^put \w+$/.test(message):
                // put name
                // example: put diamondsword
                putItem(command[1])
                break
            case /^add lapis$/.test(message):
                addLapis()
                break
            case /^enchant \d+$/.test(message):
                // enchant choice
                // example: enchant 2
                enchantItem(command[1])
                break
            case /^take$/.test(message):
                takeEnchantedItem()
                break
        }

        function closeEnchantmentTable () {
            table.close()
            bot.removeListener('chat', onChat)
        }

        async function putItem (name) {
            const item = itemByName(table.items(), name)
            if (item) {
                try {
                    await table.putTargetItem(item)
                    bot.chat(`I put ${itemToString(item)}`)
                } catch (err) {
                    bot.chat(`Error putting ${itemToString(item)}`)
                }
            } else {
                bot.chat(`Unknown item ${name}`)
            }
        }

        async function addLapis () {
            const item1 = itemByType(table.items(), ['dye', 'purple_dye', 'lapis_lazuli'])
            console.log(item1)
            const item = itemByType(table.items(), ['dye', 'purple_dye', 'lapis_lazuli'].filter(name => bot.registry.itemByName[name] !== undefined)
            .map(name => bot.registry.itemByName[name].id))
            if (item) {
                try {
                    await table.putLapis(item)
                    bot.chat(`I put ${itemToString(item)}`)
                } catch (err) {
                    bot.chat(`Error putting ${itemToString(item)}`)
                }
            } else {
                bot.chat("I don't have any lapis")
            }
        }

        async function enchantItem (choice) {
            choice = parseInt(choice, 10)
            try {
                const item = await table.enchant(choice)
                bot.chat(`Enchanted ${itemToString(item)}`)
            } catch (err) {
                bot.chat('Error enchanting')
            }
        }

        async function takeEnchantedItem () {
            try {
                const item = await table.takeTargetItem()
                bot.chat(`Got ${itemToString(item)}`)
            } catch (err) {
                bot.chat('Error getting item')
            }
        }
  }
}

function itemByType (items, type) {
    let item
    let i
    for (i = 0; i < items.length; ++i) {
        item = items[i]
        if (item && item.type === type) return item
    }
    return null
}

function itemByName (items, name) {
    let item
    let i
    for (i = 0; i < items.length; ++i) {
        item = items[i]
        if (item && item.name === name) return item
    }
    return null
}

module.exports = add