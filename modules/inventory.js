function sayItems (bot, items = null) {
    if (!items) {
        items = bot.inventory.items()
        console.log(items)
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
    console.log(destination)
    try {
        await bot.unequip(destination)
        bot.chat(`Unequipped ${destination}`)
    } catch (err) {
        bot.chat(`Cannot unequip ${destination}`)
    }
}

async function equipItem (bot, name, destination) {
    console.log(name, destination)
    const item = itemByName(bot, name)
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

async function tossItem (bot, name, amount) {
    amount = parseInt(amount, 10)
    const item = itemByName(bot, name)
    if (!item) {
        bot.chat(`I have no ${name}`)
    } else {
        try {
            if (amount) {
                await bot.toss(item.type, null, amount)
                bot.chat(`Tossed ${amount} x ${name}`)
            } else {
                await bot.tossStack(item)
                bot.chat(`Tossed ${name}`)
            }
        } catch (err) {
          bot.chat(`Unable to toss: ${err.message}`)
        }
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
    const items = bot.inventory.items()
    if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
    return items.filter(item => item.name === name)[0]
}

module.exports = {
    sayItems: sayItems,
    equipItem: equipItem,
    unequipItem: unequipItem,
    tossItem: tossItem
}