const {createGoal} = require('../lib/goals')
module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length != 1)
            return false;
        return true;
    },
    execute:(bot, args) => {
        console.log('creating explore goal')
        bot.behaviors.goal.goals.goal.push(createGoal(bot, {type:'explore'}))
        console.log('adding callback event!')
        bot.behaviors.eventPool.addEvent('Команда', '"GO_TO_RANDOM_POINT" успешно выполнена')
    }
}