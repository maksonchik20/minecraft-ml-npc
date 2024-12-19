function add(console, bot) {
    bot.behavior = {}
    require('./digging')(console, bot)
    require('./chests')(console, bot)
}

module.exports = add