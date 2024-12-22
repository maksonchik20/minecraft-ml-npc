const GOAL_DESTROY = -1;

function createGoal(bot, options) {

    let goalsTypes = {
        follow: require('../goals/follow'),
        dig: {
            paused: true,
            priority: (bot, goal) => {
                return 40
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
            }
        },  
        defend: {
            paused: true,
            priority: (bot, goal) => {
                return 70;
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
            }
        },  
        eat: {
            paused: true,
            priority: (bot, goal) => {
                return 50;
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
            }
        },  
        complex: require('./goals/complex'),
        guard: require('../goals/guard'),
        explore:reqire('./goals/explore'),
        idle: require('./goals/idle')
    }

    if(!options)
        throw new Error(`options is empty!`);
    goal = {}
    if(goalsTypes[options.type]) {
        goal = Object.create(goalsTypes[options.type])
        goal.type = options.type
    }
    goal.id = global.goalLastID;
    global.goalLastID++;
    switch (options.type) {
        case 'follow':
            if(!options.target)
                throw new Error(`Player is required for follow goal`)
            goal.target = options.target
            goal.lost = (goal.target.notReal != undefined) ? true : false
            bot.on('entityGone', (entity) => {
                if(entity.username == goal.target.username) {
                    goal.lost = true;
                }
            })
            bot.on('entitySpawn', (entity) => {
                if(entity.username == goal.target.username) {
                    goal.lost = false;
                }
            })
            return goal;
        case 'dig':
            if(!options.targetBlocks)
                throw new Error(`Target Blocks is required for dig goal`)
            goal.targetBlocks = options.targetBlocks
            return goal
        case 'idle':
            return goal;
        case 'guard':
            if(!options.locked_position) {
                goal.guard_target = options.guard_target
                goal.locked_position = false
            } else {
                goal.position = options.position
                goal.locked_position = true
            }
            return goal
        case 'complex':
            if(options.priority) {
                goal.priority = options.priority
            }
            if(!options.goals)
                throw new Error(`Complex goal need goals to perform`)
            goal.goals = options.goals
            return goal;
        case 'explore':
            return goal
        default:
            throw new Error(`${type} type of goal is not supported`);
    }
}

module.exports = { createGoal, GOAL_DESTROY }