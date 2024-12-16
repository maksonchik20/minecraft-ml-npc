const Vec3 = require('vec3').Vec3
const { entityAtEntityCursor, isEntityIntrested } = require('./functions.js')

async function add(console, bot) {

    bot.behaviors.looking = {}

    let currentCycle = 0
    let lookTimeout = null
    let lookPoll = null;
    let lookToFar = 0
    const minCycles = 3

    bot.behaviors.looking.target = null
    bot.behaviors.walking = false

    bot.behaviors.looking.isLookingFor = () => {
        return bot.behaviors.looking.target != null
    }

    bot.behaviors.looking.canLook = () => {
        return !bot.behaviors.walking;
    }

    bot.behaviors.looking.stopLooking = () => {
        bot.behaviors.looking.target = null;
        clearInterval(lookTimeout);
    }

    bot.behaviors.looking.isInterestedIn = (entity) => {
        if(bot.behaviors.looking.target == null)
            return false;
        if(entity == null)
            return false;
        if(entity.username == bot.behaviors.looking.target.username)
            return true;
        if(entity == bot.behaviors.looking.target)
            return true;
    }

    bot.on('goal_reached', () => {
        bot.behaviors.walking = false
    })

    bot.on('goal_updated', () => {
        bot.behaviors.walking = true
    })

    bot.on('end', () => {
        clearInterval(lookTimeout);
        clearInterval(lookPoll);
    })

    async function look() {
        if(!bot.behaviors.looking.canLook())
            return
        if(bot.behaviors.looking.target == null)
            return
        bot.lookAt(bot.behaviors.looking.target.position.offset(0, bot.behaviors.looking.target.eyeHeight, 0))
        if(bot.behaviors.looking.target.position.distanceTo(bot.player.entity.position) > 7.5) {
            if(lookToFar > 50)
                bot.behaviors.looking.stopLooking()
            lookToFar++
        } else {
            lookToFar = 0;
        }
    }

    async function lookingPolling() {
        if(bot.behaviors.looking.isLookingFor()) {
            console.log('Checking interest point')
            let prefferedChance = 0.0;

            if(entityAtEntityCursor(bot, bot.behaviors.looking.target) == bot.player.entity) {
                prefferedChance = 0.1;
            }

            if(bot.behaviors.follow.target == bot.behaviors.looking.target) {
                prefferedChance = 0.5;
            }

            if(Math.random() < prefferedChance) {
                currentCycle = 0;
                console.log('Reintrested in point!');
            }

            if(currentCycle >= minCycles) {
                let chanceOfDeselecting = Math.pow(1.7, currentCycle - minCycles) / 100.0
                if(Math.random() < chanceOfDeselecting) {
                    bot.behaviors.looking.target = null;
                    clearInterval(lookTimeout);
                }
            }
            currentCycle++
        } else {

            if(bot.behaviors.looking.canLook()) {
                bot.look(bot.player.entity.yaw, 0.0);
            }

            console.log('Selecting next target...')
            
            let selected = null
            let chanceOfSelecting = 0.05
            let prefferedChance = 0.9

            let preffered = null

            let parts = []
            let val = Object.values(bot.entities)
            val.forEach((value) => {
                if(value == undefined)
                    return
                if(value.username === bot.username)
                    return
                if(bot.player.entity.position.distanceTo(value.position) < 5.0) {
                    if(isEntityIntrested(bot, value)) {
                        console.log('He is looking at me!');
                        if(preffered == null) {
                            preffered = value;
                            chanceOfSelecting = 0.3
                            return;
                        } else if (bot.player.entity.position.distanceTo(preffered.position) > bot.player.entity.position.distanceTo(value.position)){
                            parts.push(preffered);
                            preffered = value;
                            return;
                        }
                    }
                    parts.push(value)
                }
            })

            if(bot.behaviors.follow.isFollowing()) {
                preffered = bot.behaviors.follow.target;
                prefferedChance = 0.9;
            }

            if(preffered == null) {
                if(parts.length != 0) {
                    pos = Math.floor(Math.random() * parts.length)
                    selected = parts[pos]
                }
            } else {
                if(Math.random() < prefferedChance || parts.length == 0) {
                    selected = preffered
                    chanceOfSelecting = 0.6
                } else {
                    pos = Math.floor(Math.random() * parts.length)
                    selected = parts[pos]
                }
            }

            if(Math.random() < chanceOfSelecting && selected != null) {
                console.log('Started looking at!')
                currentCycle = 0
                lookToFar = 0
                bot.behaviors.looking.target = selected
                lookTimeout = setInterval(look, 50)
            }
        }
    }
    
    lookPoll = setInterval(lookingPolling, 50000)
}

module.exports = add