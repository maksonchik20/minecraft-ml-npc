module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 2 && text.split(/[\t\n\r ]/).length != 1)
            return false;
        return true;
    },
    execute: (bot, args) => {
        let goalsToStop = bot.behaviors.goals.goal.goals.filter((_goal) => {
            return _goal.type == 'follow' && (args != '' ? _goal.target.username == args : true)
        })
        if(goalsToStop.length == 0) {
            bot.behaviors.eventPool.addEvent('Команда', `"STOP_FOLLOW" не выполнена. Бот сейчас не следует за игроком "${args}".`);
            return;
        } 
        goalsToStop.forEach((goal) => {
            bot.behaviors.goals.removeGoal(goal);
        })
        bot.behaviors.eventPool.addEvent('Команда', '"STOP_FOLLOW" успешно выполнена');
    }
}