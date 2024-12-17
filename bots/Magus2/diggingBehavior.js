function add(console, bot) {
    bot.behavior = {}
    require('./digging')(console, bot)
}

module.exports = add