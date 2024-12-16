const { Movements, goals } = require('mineflayer-pathfinder')

function guardArea(bot, position) {
    bot.guardPos = position
    
    if (!bot.pvp.target) {
      moveToGuardPos(bot)
    }
  }

function stopGuarding (bot) {
  bot.guardPos = null
  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

function moveToGuardPos(bot) {
  bot.pathfinder.setMovements(new Movements(bot))
  bot.pathfinder.setGoal(new goals.GoalBlock(bot.guardPos.x, bot.guardPos.y, bot.guardPos.z))
}

module.exports = {
  guardArea: guardArea,
  stopGuarding: stopGuarding,
  moveToGuardPos: moveToGuardPos
}
