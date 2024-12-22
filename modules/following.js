const { goals: { GoalNear } } = require('mineflayer-pathfinder');

function add(console, bot) {

    const rangeFollow = 3
    let followPoll = null

    bot.behaviors.follow = {}
    bot.behaviors.follow.target = null;

    bot.behaviors.follow.isFollowing = () => {
        return bot.behaviors.follow.target != null
    }

    bot.behaviors.follow.startFollowing = (target) => {
        bot.emit('startFollow', target)
        if(followPoll != null) {
            bot.behaviors.follow.stopFollowing();
        }
        bot.behaviors.follow.target = target;
        currentGoal = null;
        followPoll = setInterval(followPolling, 500);
    }

    bot.behaviors.follow.stopFollowing = () => {
        bot.emit('stopFollow', bot.behaviors.follow.target)
        bot.behaviors.follow.target = null;
        currentGoal = null;
        clearInterval(followPoll)
        followPoll = null;
    }

    bot.behaviors.follow.isFollowingEntity = (entity) => {
        if(bot.behaviors.follow.target == null)
            return false;
        if(entity == null)
            return false;
        if(bot.behaviors.follow.target.username == entity.username)
            return true;
        if(bot.behaviors.follow.target == entity)
            return true;
    }

    bot.on('entityGone', (entity) => {
        if(bot.behaviors.follow.target == null)
            return;
        if(entity.type == 'player' && entity == bot.behaviors.follow.target) {
            bot.chat('Please, wait! I can\'t keep up with you!');
        }
    })

    bot.on('entitySpawn', (entity) => {
        if(bot.behaviors.follow.target == null)
            return;
        if(entity.type == 'player' && entity.username == bot.behaviors.follow.target.username) {
            bot.chat('Here you are!');
            bot.behaviors.follow.target = entity;
        }
    })

    bot.on('end', () => {
        clearInterval(followPoll);
    })


    function distance(a, b) {
        let dx = a.x - b.x
        let dy = a.y - b.y
        let dz = a.z - b.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    async function followPolling() {
        if(bot.behaviors.follow.target != null) {
            const { x: targetX, y: targetY, z: targetZ } = bot.behaviors.follow.target.position

            let goal = new GoalNear(targetX, targetY, targetZ, rangeFollow)

            if(bot.pathfinder.goal == null || bot.pathfinder.goal == undefined) {
                bot.pathfinder.setGoal(goal)
            } else if (distance(bot.pathfinder.goal, goal) > 2.0) {
                bot.pathfinder.setGoal(goal)
            }
        } else {
            console.log('Lost target...')
        }
    }
}

module.exports = add