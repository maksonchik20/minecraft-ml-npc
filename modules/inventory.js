function sayItems (bot, items = null) {
    if (!items) {
        console.log(bot.inventory.items())
        items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
    }
    const output = items.map(itemToString).join(', ')
    if (output) {
        bot.chat(output)
    } else {
        bot.chat('empty')
    }
}

async function unequipItem (bot, destination) {
    try {
        await bot.unequip(destination)
        bot.chat(`Unequipped ${destination}`)
    } catch (err) {
        bot.chat(`Cannot unequip ${destination}`)
    }
}

async function equipItem (bot, name, destination) {
    const item = itemByName(name)
    if (item) {
        try {
            await bot.equip(item, destination)
            bot.chat(`Equipped ${name}`)
        } catch (err) {
            bot.chat(`Cannot equip ${name}: ${err.message}`)
        }
    } else {
        bot.chat(`I have no ${name}`)
    }
}

function itemToString (item) {
    if (item) {
        return `${item.name} x ${item.count}`
    } else {
        return '(nothing)'
    }
}

function itemByName (bot, name) {
    console.log(bot.inventory)
    const items = bot.inventory.items()
    if (!items) {
        console.log('WTF WHYYY')
    }
    else {
        console.log('BRUH')
    }
    if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
    return items.filter(item => item.name === name)[0]
}

module.exports = {
    sayItems: sayItems,
    equipItem: equipItem,
    unequipItem: unequipItem
}