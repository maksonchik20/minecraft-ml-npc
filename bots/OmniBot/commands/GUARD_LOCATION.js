const { createGoal } = require("../lib/goals");
const STOP_GUARD = require("./STOP_GUARD");

module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 1 && text.split(/[\t\n\r ]/).length != 4)
            return false;
        let args = text.split(/[\t\n\r ]/)
        for(let i = 1; i<text.length; ++i) {
            if(!isFinite(args[i]) && !(args[i] == '~')) {
                return false;
            }
        }
        return true;
    },
    execute: (bot, args) => {
        let strs = args.split(/[\t\n\r ]/)
        let positon = bot.player.entity.positon
        if(strs.length == 3) {
            if(isFinite(strs[0])) {
                positon.x = Number.parseFloat(strs[0])
            }
            if(isFinite(strs[1])) {
                positon.y = Number.parseFloat(strs[1])
            }
            if(isFinite(strs[2])) {
                positon.z = Number.parseFloat(strs[2])
            }
        }

        STOP_GUARD.execute(bot)

        console.log('creating goal!')
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'guard',
            position: position,
            locked_position: true
        }))
        console.log('adding callback event!');
        bot.behaviors.eventPool.addEvent('Команда', '"GUARD_LOCATION" успешно выполнена');
    }
}