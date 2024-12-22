const { protect_user } = require("../goals/guard");
const { username } = require("../goals/guard");
const { createGoal } = require("./../goals");

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
        if(bot.players[args].entity == null) {
            console.log('Player ' + args + ' is too far!');
            entity = {
                position: bot.player.entity.position,
                username: args,
                notReal: true
            }
        }
        
        // Guard Event
        if(bot.players[args].entity == null) {
            bot.behaviors.eventPool.addEvent('Команда', `"GUARD_USER" не выполнена. Игрок "${args}" слишком далеко`);
            console.log('Player ' + args + ' is too far!');
            return;
        }
        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'follow',
            target: entity
        }))
        console.log('adding callback event!');
        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'guard',
            username: args,
            protect_user: true
        }))
        console.log('adding callback event!');
        bot.behaviors.eventPool.addEvent('Команда', '"GUARD_USER" успешно выполнена');
    }
}

