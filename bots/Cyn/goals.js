function createGoal(options) {

    global.goalLastID = 0;

    const GOAL_DESTROY = -1;

    let goalPriority = {
        follow: (bot, goal) => {
            if(goal.lost)
                return 5;
            return 90;
        },
        look: (bot, goal) => {
            if(goal.lost)
                return GOAL_DESTROY;
            return 40;
        },
        dig: (bot, goal) => {
            return 70
        },
        defend: (bot, goal) => {
        },
        eat: (bot, goal) => {
        },
        handle_chat: (bot, goal) => {
            if(goal.sent)
                return -1;
            return 95;
        }
    }

    if(!options)
        throw new Error(`options is empty!`);
    goal = {}
    goal.id = global.goalLastID;
    global.goalLastID++;
    goal.type = options.type;
    if(goalPriority[type]) {
        goal.priority = goalPriority[type]
    }
    switch (type) {
        case 'follow':
            if(!options.player)
                throw new Error(`Player is required for follow goal`)
            goal.player = options.player
            goal.lost = (options.player.entity) ? false : true
            bot.on('entityGone', (entity) => {
                if(entity.username == goal.player.username) {
                    goal.lost = true;
                }
            })
            bot.on('entitySpawn', (entity) => {
                if(entity.username == goal.player.username) {
                    goal.lost = false;
                }
            })
            return goal;
        case 'look':
            if(!options.target)
                throw new Error(`Target is required for look goal`)
            goal.target = options.target
            goal.on()
            return goal;
        case 'dig':
            if(!options.targetBlocks)
                throw new Error(`Target Blocks is required for dig goal`)
            goal.targetBlocks = options.targetBlocks
            return goal
        case 'goto':
            break;
        case 'complex':
            if(!options.priority) {
                options.priority = (bot, goal) => {
                    return 50;
                }
            }
            if(!options.goals)
                throw new Error(`Complex goal need goals to perform`)
            goal.priority = options.priority
            goal.goals = options.goals
            return goal;
        default:
            throw new Error(`${type} type of goal is not supported`);
    }
}

