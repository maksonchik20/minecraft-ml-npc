module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 1)
            return false;
        return true;
    },
    execute: (bot, args) => {
        let goalsToStop = bot.behaviors.goals.goal.goals.filter((_goal) => {
            return _goal.type == 'guard'
        })
        let usernames = []
        goalsToStop.forEach((_goal) => {
            if(!_goal.locked_position) {
                if(_goal.guard_target.username) {
                    usernames.push(_goal.guard_target.username)
                }
            }
        })
        
        let followGoalsToStop = bot.behaviors.goals.goal.goals.filter((_goal) => {
            _goal.type == 'follow' && usernames.includes(_goal.target.username)
        })

        if(goalsToStop.length + followGoalsToStop.length == 0) {
            bot.behaviors.eventPool.addEvent('Команда', `"STOP_GUARD" не выполнена. Бот сейчас ничего за не защищает.`);
            return;
        }

        goalsToStop.forEach((goal) => {
            bot.behaviors.goals.removeGoal(goal);
        })

        followGoalsToStop.forEach((_goal) => {
            bot.behaviors.goals.removeGoal(_goal)
        })

        bot.behaviors.eventPool.addEvent('Команда', '"STOP_GUARD" успешно выполнена');
    }
}