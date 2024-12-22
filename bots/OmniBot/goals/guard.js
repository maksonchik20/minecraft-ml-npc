const { goals } = require("mineflayer-pathfinder");

module.exports = {
    paused: true,
    priority: (bot, goal) => {
        let pos = (this.locked_position ? this.position : this.guard_target.position)
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
        this.guard_poll = setInterval(() => {
            if(!bot.behaviors.fighting) {
                let pos = (this.locked_position ? this.position : this.guard_target.position)
                let sel = Object.values(bot.entities).filter((entity) => {
                    return entity.type == 'hostile' && 
                    entity.position.distanceTo(pos) < 7 &&
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
                    let goal = new GoalNear(targetX, targetY, targetZ, 3.0)

                    if(bot.pathfinder.goal == null || bot.pathfinder.goal == undefined) {
                        bot.pathfinder.setGoal(goal)
                    } else if (distance(bot.pathfinder.goal, goal) > 2.0) {
                        bot.pathfinder.setGoal(goal)
                    }
                }
            }
        }, 50)
    },
    pause: (bot, goal) => {
        if(goal.paused) return;
        goal.paused = true;
        clearInterval(this.guard_poll)
        bot.pvp.stop()
    },
    locked_position: false,
    guard_target: null,
    position: null,
    guard_poll: null,
}