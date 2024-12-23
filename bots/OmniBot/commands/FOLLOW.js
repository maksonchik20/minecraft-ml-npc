const { createGoal } = require("../lib/goals");
const STOP_FOLLOW = require("./STOP_FOLLOW");

module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 2)
            return false;
        return true;
    },
    execute: (bot, args) => {
        console.log('Player to follow ' + args)
        if(bot.players[args] == undefined || bot.players[args] == null) {
            bot.behaviors.eventPool.addEvent('Команда', `"FOLLOW" не выполнена. Игрок "${args}" не найден`);
            return;
        }
        let entity = bot.players[args].entity
        if(bot.players[args].entity == null) {
            console.log('Player ' + args + ' is too far!');
            entity = {
                position: bot.player.entity.position,
                username: args,
                notReal: true
            }
        }

        STOP_FOLLOW.execute(bot)

        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'follow',
            target: entity
        }))
        console.log('adding callback event!');
        bot.behaviors.eventPool.addEvent('Команда', '"FOLLOW" успешно выполнена');
    }
}