
async function goToSleep (bot) {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block)
    })
    if (bed) {
        console.log(JSON.stringify(bed))
        try {
          bot.sleep(bed)
          bot.chat("I'm sleeping")
        } catch (err) {
            console.log(err)
            bot.chat(`I can't sleep: ${err.message}`)
        }
    } else {
        bot.chat('No nearby bed')
    }
}

async function wakeUp (bot) {
    try {
        await bot.wake()
    } catch (err) {
        bot.chat(`I can't wake up: ${err.message}`)
    }
}

module.exports = {
    goToSleep: goToSleep,
    wakeUp: wakeUp
}
