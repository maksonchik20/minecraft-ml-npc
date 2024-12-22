const { loader } = require('mineflayer-auto-eat')


function add(console, bot) {
    bot.loadPlugin(loader)
    bot.autoEat.enableAuto()

    bot.autoEat.on('eatStart', (opts) => {
        bot.chat('Eat started!');
        console.log(`Started eating ${opts.food.name} in ${opts.offhand ? 'offhand' : 'hand'}`)
    })

    bot.autoEat.on('eatFinish', (opts) => {
        bot.chat('Eat stopped!');
        console.log(`Finished eating ${opts.food.name}`)
    })

    bot.autoEat.on('eatFail', (error) => {
        bot.chat('I want eat')
        console.error('Eating failed:', error)
    })
}

module.exports = add