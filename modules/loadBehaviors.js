function add(bot) {
    bot.behaviors = {}

    require('./following')(bot)
    require('./looking')(bot)
    require('./attacking')(bot)
    require('./chatEvents')(bot)
}

module.exports = add