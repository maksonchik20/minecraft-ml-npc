const fs = require('fs/promises');

async function add(console, bot) {

    bot.once('spawn', async () => {
        bot.behaviors.eventPool.addEvent(`[Событие]: Бот зашёл на сервер"`)
        
        console.log('Hello hello!')
    })
}

module.exports = add