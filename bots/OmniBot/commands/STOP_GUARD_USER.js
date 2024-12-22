module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 2)
            return false;
        return true;
    },
    execute: (bot, args) => {
        let goalsToStop = bot.behaviors.goals.goal.goals.filter((_goal) => {
            return _goal.type == 'guard' && _goal.target.username == args
        })
        if(goalsToStop.length == 0) {
            bot.behaviors.eventPool.addEvent('Команда', `"STOP_GUARD" не выполнена. Бот сейчас не следует за игроком "${args}".`);
            return;
        }
        goalsToStop.forEach((goal) => {
            bot.behaviors.goals.removeGoal(goal);
        })
        bot.behaviors.eventPool.addEvent('Команда', '"STOP_GUARD" успешно выполнена');
    }
}