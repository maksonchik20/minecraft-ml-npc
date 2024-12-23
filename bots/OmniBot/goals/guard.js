const { goals } = require("mineflayer-pathfinder");

module.exports = {
    paused: true,
    priority: (bot, goal) => {
        let pos = (goal.locked_position ? goal.position : goal.guard_target.position)
        if(Object.values(bot.entities).filter((entity) => {
            return entity.type == 'hostile' && 
            entity.position.distanceTo(pos) < 16 &&
            entity.displayName !== 'Armor Stand'
        }).length == 0 || bot.player.entity.position.distanceTo(pos) > 16) {
            return 45;
        }
        if(!paused || bot.player.entity.position.distanceTo(pos) < 7)
            return 55;
    },
    execute: (bot, goal) => {
        if(!goal.paused) return;
        goal.paused = false;
        let goal_pollFunc = () => {
            if(!bot.behaviors.fighting) {
                let pos = (goal.locked_position == true ? goal.position : goal.guard_target.position)
                let sel = Object.values(bot.entities).filter((entity) => {
                    return entity.type == 'hostile' && 
                    entity.position.distanceTo(pos) < 16 &&
                    entity.displayName !== 'Armor Stand'
                })
                if(sel.length > 0) {
                    let target = sel[0]
                    sel.forEach((entity) => {
                        if(entity.position.distanceTo(pos) < target.position.distanceTo(pos))
                            target = entity
                    })
                    bot.pvp.attack(target)
                } else {
                    let nngoal = new GoalNear(targetX, targetY, targetZ, 3.0)

                    if(bot.pathfinder.goal == null || bot.pathfinder.goal == undefined) {
                        bot.pathfinder.setGoal(nngoal)
                    } else if (distance(bot.pathfinder.goal, nngoal) > 2.0) {
                        bot.pathfinder.setGoal(nngoal)
                    }
                }
            }
        }
        goal.guard_poll = setInterval(goal_pollFunc.bind(goal), 50)
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
        clearInterval(goal.guard_poll)
        bot.pvp.stop()
    },
    locked_position: false,
    guard_target: null,
    position: null,
    guard_poll: null,
}