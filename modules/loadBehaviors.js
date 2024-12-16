function add(bot) {
    bot.behaviors = {}

    require('./following')(bot)
    require('./looking')(bot)
}

module.exports = add