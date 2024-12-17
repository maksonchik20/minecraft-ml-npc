const fs = require('fs/promises');

async function add(console, bot) {

    bot.once('spawn', async () => {
        bot.behaviors.eventPool.addEvent({'event_type': 'bot_joined'})
        
        console.log('Hello hello!')
    })
}

module.exports = add