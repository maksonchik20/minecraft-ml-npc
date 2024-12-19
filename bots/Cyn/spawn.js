const fs = require('fs/promises');

async function add(console, bot) {

    bot.once('spawn', async () => {
        bot.behaviors.eventPool.addEvent('Бот', `Ты зашёл на сервер`)
        
        console.log('Hello hello!')
    })
}

module.exports = add