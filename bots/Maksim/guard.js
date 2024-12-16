const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

// Assign the given location to be guarded
function guardArea(bot, pos) {
    bot.guardPos = pos
    // We we are not currently in combat, move to the guard pos
    if (!bot.pvp.target) {
      moveToGuardPos(bot)
    }
  }

// Cancel all pathfinder and combat
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
