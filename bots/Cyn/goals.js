function createGoal(options) {
    if(!options)
        throw new Error(`options is empty!`);
    goal = {}
    goal.type = options.type;
    switch (type) {
        case 'follow':
            goal.priority = 90
            if(!options.player)
                throw new Error(`Player is required for follow goal`)
            goal.player = options.player
            return goal;
        case 'look':
            goal.priority = 40
            if(!options.target)
                throw new Error(`Target is required for look goal`)
            goal.target = options.target
            return goal;
        case 'dig':
            goal.priority = 
        case 'complex':
            break;
        default:
            throw new Error(`${type} type of goal is not supported`);
    }
}

