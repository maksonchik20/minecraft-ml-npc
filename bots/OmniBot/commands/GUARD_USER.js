const { createGoal } = require("./../lib/goals");
const STOP_GUARD = require("./STOP_GUARD");

module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 2)
            return false;
        return true;
    },
    execute: (bot, args) => {
        // Follow event
        console.log('Player to follow ' + args)

        if(bot.players[args] == undefined || bot.players[args] == null) {
            bot.behaviors.eventPool.addEvent('Команда', `"GUARD_USER" не выполнена. Игрок "${args}" не найден`);
            return;
        }

        let entity = bot.players[args].entity

        if(entity == null) {
            console.log('Player ' + args + ' is too far!');
            entity = {
                position: bot.player.entity.position,
                username: args,
                notReal: true
            }
        }

        STOP_GUARD.execute(bot)

        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'follow',
            target: entity
        }))
        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'guard',
            guard_target: entity,
            locked_position: false
        }))
        console.log('adding callback event!');
        bot.behaviors.eventPool.addEvent('Команда', '"GUARD_USER" успешно выполнена');
    }
}

