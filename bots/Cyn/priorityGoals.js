const { createGoal } = require("./goals")

function add(console, bot) {
    global.goalLastID = 0;

    bot.behaviors.goals = {}

    bot.behaviors.goals.goal = createGoal(bot, {
            type: 'complex',
            goals: [
                createGoal(bot, {
                    type: 'idle'
                })
            ]
        }
    )

    bot.behaviors.goals.addGoal = (goal) => {
        bot.behaviors.goals.goal.goals.push(goal);
    }

    bot.behaviors.goals.removeGoal = (goal) => {
        if(goal.id == undefined || goal.id == null || typeof goal.id != 'number') return;
        bot.behaviors.goals.removeGoalById(goal.id)
    }

    bot.behaviors.goals.removeGoalById = (id) => {
        let dstr = bot.behaviors.goals.goal.goals.filter((goal) => {
            return goal.id == id
        })
        dstr.forEach(goal => {
            goal.pause(bot, goal)
        });
        bot.behaviors.goals.goal.goals = bot.behaviors.goals.goal.goals.filter((goal) => {
            return goal.id != id
        })
        console.log('removed goal? size ' + bot.behaviors.goals.goal.goals.length.toString())
    }

    bot.behaviors.goals.goal.execute(bot, bot.behaviors.goals.goal);

}

module.exports = add