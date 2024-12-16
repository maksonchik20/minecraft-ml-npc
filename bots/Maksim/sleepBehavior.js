const {goToSleep, wakeUp} = require('./sleep')


function add(console, bot) {
    bot.on('chat', (username, message) => {
        if (username === bot.username) return

        if (message == 'sleep') {
            goToSleep(bot)
        } else if (message == 'wakeup') {
            wakeUp(bot)
        }
    })
    bot.on('sleep', () => {
        bot.chat('Good night!')
    })
    bot.on('wake', () => {
        bot.chat('Good morning!')
    })
}

module.exports = add