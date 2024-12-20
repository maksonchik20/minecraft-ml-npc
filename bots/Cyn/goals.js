function createGoal(bot, options) {

    const GOAL_DESTROY = -1;

    let goalsTypes = {
        follow: {
            paused: true,
            priority: (bot, goal) => {
                if(goal.lost)
                    return 5;
                return 90;
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
                bot.behaviors.follow.startFollowing(goal.target);
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
                if(bot.behaviors.follow.target.username == goal.target.username)
                    bot.behaviors.follow.stopFollowing();
            },
            target: undefined,
            lost: false
        },
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
        complex: {
            paused: true,
            priority: (bot, goal) => {
                mx = GOAL_DESTROY
                goal.goals.forEach(_goal => {
                    mx = Math.max(mx, _goal.priority(bot, _goal))
                });
                return mx;
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
                if(goal.current != null)
                    goal.current.execute(bot, goal.current);
                goal.checkLoop = setInterval(() => {
                    let to_start = null;
                    let dstr = goal.goals.filter((_goal) => {return _goal.priority(bot, _goal) == GOAL_DESTROY})
                    goal.goals = goal.goals.filter((_goal) => {return _goal.priority(bot, _goal) != GOAL_DESTROY})
                    dstr.forEach((_goal) => {
                        _goal.pause(bot, _goal)
                    })
                    //console.log('Available goals:')
                    goal.goals.forEach(_goal => {
                        //console.log(`${_goal.type} ${_goal.priority(bot, _goal)}`)
                        if(to_start == null)
                            to_start = _goal
                        else if(to_start.priority(bot, to_start) < _goal.priority(bot, _goal))
                            to_start = _goal
                    });
                    /*if(goal.current)
                        console.log(`Current ${goal.current.type} ${goal.current.priority(bot, goal.current)}`)
                    if(to_start)
                        console.log(`Next ${to_start.type} ${to_start.priority(bot, to_start)}`)*/
                    if(to_start == null)
                        return;
                    if(goal.current == null) {
                        //console.log(`Changed goal to ${to_start.type}`)
                        goal.current = to_start;
                        goal.current.execute(bot, goal.current)
                    } else if(to_start.id != goal.current.id) {
                        //console.log(`Changed goal from ${goal.current.type} to ${to_start.type}`)
                        goal.current.pause(bot, goal.current);
                        goal.current = to_start;
                        goal.current.execute(bot, goal.current);
                    }
                }, 50)
                goal.handler = () => {
                    clearInterval(goal.checkLoop)
                }
                bot.on('end', goal.handler)
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
                goal.current.pause(bot, goal.current)
                clearInterval(goal.checkLoop)
                bot.removeListener(goal.handler)
            },
            goals: [],
            current: null,
            checkLoop: null,
            handler: null
        },
        idle: {
            paused: true,
            priority: (bot, goal) => {
                return 5;
            },
            execute: (bot, goal) => {
                if(!goal.paused) return;
                goal.paused = false;
            },
            pause: (bot, goal) => {
                if(goal.paused) return;
                goal.paused = true;
            }
        }
    }

    if(!options)
        throw new Error(`options is empty!`);
    goal = {}
    if(goalsTypes[options.type]) {
        goal = goalsTypes[options.type]
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
        case 'complex':
            if(options.priority) {
                goal.priority = options.priority
            }
            if(!options.goals)
                throw new Error(`Complex goal need goals to perform`)
            goal.goals = options.goals
            return goal;
        default:
            throw new Error(`${type} type of goal is not supported`);
    }
}

module.exports = { createGoal }