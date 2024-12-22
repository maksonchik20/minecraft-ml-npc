const { username } = require("../goals/GUARD_LOCATION");
const { createGoal } = require("./../goals");

module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 2)
            return false;
        return true;
    },
    execute: (bot, args) => {
        console.log('Player to GUARD_LOCATION ' + args)
        if (bot.players[args] == undefined || bot.players[args] == null) {
            bot.behaviors.eventPool.addEvent('Команда', `"GUARD_LOCATION" не выполнена. Игрок "${args}" не найден`);
            return;
        }
        if(bot.players[args].entity == null) {
            bot.behaviors.eventPool.addEvent('Команда', `"GUARD_LOCATION" не выполнена. Игрок "${args}" слишком далеко`);
            console.log('Player ' + args + ' is too far!');
            return;
        }
        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'guard',
            username: args,
            protect_user: false
        }))
        console.log('adding callback event!');
        bot.behaviors.eventPool.addEvent('Команда', '"GUARD_LOCATION" успешно выполнена');
    }
}