const { Movements, goals } = require('mineflayer-pathfinder')

function guardArea(bot, position, protect_player) {
    bot.protect_player = protect_player
    if (protect_player === true) {
        bot.guardPos = position;
    } else {
        bot.guardPos = new goals.GoalBlock(position.x, position.y, position.z)
    }
    if (!bot.pvp.target) {
        moveToGuardPos(bot)
    }
}

function stopGuarding (bot) {
    bot.guardPos = null
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
    bot.protect_player = null
}

function moveToGuardPos(bot) {
    bot.pathfinder.setMovements(new Movements(bot))
    if (bot.protect_player) {
        bot.pathfinder.setGoal(new goals.GoalBlock(bot.guardPos.x, bot.guardPos.y, bot.guardPos.z))
    } else {
        bot.pathfinder.setGoal(bot.guardPos)
    }
}

module.exports = {
    guardArea: guardArea,
    stopGuarding: stopGuarding,
    moveToGuardPos: moveToGuardPos
}
