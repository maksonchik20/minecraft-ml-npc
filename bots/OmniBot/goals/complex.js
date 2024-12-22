const { GOAL_DESTROY } = require("../goals");

module.exports = {
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
}