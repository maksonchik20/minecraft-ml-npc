function add(console, bot) {
    bot.once('spawn', () => {
        bot.chat('Hello guys!');
        console.log('Hello hello!')
    })
}

module.exports = add