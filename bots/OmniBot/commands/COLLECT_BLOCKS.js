// const { protect_user } = require("../goals/guard");
// const { username } = require("../goals/guard");
// const { createGoal } = require("./../goals");
const { collectBlock } = require('../../../modules/digging')
const {createGoal} = require("../lib/goals");

module.exports = {
    validator: (text='') => {
        return text.split(/[\t\n\r ]/).length <= 3;
    },
    execute: (bot, args) => {
        // Follow event
        let strs = args.split(/[\t\n\r ]/)
        console.log(strs)
        console.log(strs[0])
        console.log(strs[1])
        bot.behaviors.goals.goal.goals.push(createGoal(bot, {
            type: 'collect',
            block: strs[0],
            amount: strs[1]
        }))
        console.log('adding callback event!');
        let goalsToStop = bot.behaviors.goals.goal.goals.filter((_goal) => {
            return _goal.type === 'collect'
        })
        if(goalsToStop.length == 0) {
            bot.behaviors.eventPool.addEvent('Команда', `"STOP_COLLECTING" не выполнена. Бот сейчас не следует за игроком "${args}".`);
            return;
        }
        goalsToStop.forEach((goal) => {
            bot.behaviors.goals.removeGoal(goal);
        })
        bot.behaviors.eventPool.addEvent('Команда', '"COLLECT_BLOCKS" успешно выполнена');
    }
}

