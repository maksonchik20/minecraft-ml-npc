const Vec3 = require('vec3').Vec3
const { entityAtEntityCursor, isEntityLookingAtBot } = require('./functions.js')
const conv = require('./../node_modules/mineflayer/lib/conversions.js')
const { createDoneTask, createTask } = require('./../node_modules/mineflayer/lib/promise_utils.js')

async function add(console, bot) {

    bot.behaviors.looking = {}
    
    bot.behaviors.looking.task = createDoneTask()

    bot.on('move', () => {
        if (!bot.behaviors.looking.task.done) {
            bot.behaviors.looking.task.finish()
        }
    })

    bot.look = async (yaw, pitch, force) => {
        if (!bot.behaviors.looking.task.done) {
            bot.behaviors.looking.task.finish() // finish the previous one
        }
        bot.behaviors.looking.task = createTask()

        while(yaw > 180.0)
           yaw -= 360.0;
        while(yaw < -180.0)
            yaw += 360.0;
        pitch = Math.max(-90.0, Math.min(90.0, pitch));

        if(!isFinite(yaw) || isNaN(yaw)) {
            yaw = 0.0
        }

        if(!isFinite(pitch) || isNaN(pitch)) {
            pitch = 0.0
        }
    
        // this is done to bypass certain anticheat checks that detect the player's sensitivity
        // by calculating the gcd of how much they move the mouse each tick
        const sensitivity = conv.fromNotchianPitch(0.15) // this is equal to 100% sensitivity in vanilla
        const yawChange = Math.round((yaw - bot.entity.yaw) / sensitivity) * sensitivity
        const pitchChange = Math.round((pitch - bot.entity.pitch) / sensitivity) * sensitivity
    
        if (yawChange === 0 && pitchChange === 0) {
            return
        }
    
        bot.entity.yaw += yawChange
        while(bot.entity.yaw > 180.0)
            bot.entity.yaw -= 360.0;
        while(bot.entity.yaw < -180.0)
            bot.entity.yaw += 360.0;
        bot.entity.pitch += pitchChange;
        bot.entity.pitch = Math.max(-90.0, Math.min(90.0, bot.entity.pitch));

        if(!isFinite(bot.entity.yaw) || isNaN(bot.entity.yaw)) {
            bot.entity.yaw = 0.0
        }

        if(!isFinite(bot.entity.pitch) || isNaN(bot.entity.pitch)) {
            bot.entity.pitch = 0.0
        }
    
        if (force) {
            bot.entity.yaw = yaw
            bot.entity.pitch = pitch
            return
        }
    
        await bot.behaviors.looking.task.promise
    }    

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
    
    bot.behaviors.looking.lookAtEntity = (entity) => {
        if(!bot.behaviors.looking.canLook())
            return
        if(entity == null)
            return
        if(!entity.eyeHeight)
            entity.eyeHeight = entity.height * 0.88
        bot.lookAt(entity.position.offset(0, entity.eyeHeight, 0))
    }

    bot.behaviors.looking.preferSelectingFuncs = []
    
    bot.behaviors.looking.preferSelectingFuncs.push(() => {
        if(bot.behaviors.follow.isFollowing()) {
            return {
                preffered: bot.behaviors.follow.target,
                prefferedChance: 0.9,
                chanceOfPrefferedSelecting: 0.5
            }
        }
        return {
            preffered: null,
            prefferedChance: 0.9,
            chanceOfPrefferedSelecting: 0.5
        }
    })

    bot.behaviors.looking.preferSelectingFuncs.push(() => {
        let preffered = null;
        let prefferedChance = 0.4;
        let chanceOfPrefferedSelecting = 0.3;

        let val = Object.values(bot.entities)
        val.forEach((value) => {
            if(value == undefined)
                return
            if(value.username === bot.username)
                return
            if(bot.player.entity.position.distanceTo(value.position) < 5.0) {
                if(isEntityLookingAtBot(bot, value, 5.0)) {
                    console.log('He is looking at me!');
                    if(preffered == null) {
                        preffered = value;
                        prefferedChance = 0.4
                        chanceOfPrefferedSelecting = 0.3
                        return;
                    } else if (bot.player.entity.position.distanceTo(preffered.position) > bot.player.entity.position.distanceTo(value.position)){
                        preffered = value;
                        return;
                    }
                }
            }
        })

        return {
            preffered: preffered,
            prefferedChance: prefferedChance,
            chanceOfPrefferedSelecting: chanceOfPrefferedSelecting
        }
    })

    bot.behaviors.looking.preferSelect = () => {
        let preffered = null;
        let prefferedChance = 0.0;
        let chanceOfPrefferedSelecting = 0.00;

        bot.behaviors.looking.preferSelectingFuncs.forEach((func) => {
            let {preffered: rPreffered, prefferedChance: rPrefferedChance, chanceOfPrefferedSelecting: rChanceOfPrefferedSelecting} = func()
            if(prefferedChance * 0.65 + chanceOfPrefferedSelecting * 0.35 < rPrefferedChance * 0.65 + rChanceOfPrefferedSelecting * 0.35 && rPreffered != null) {
                preffered = rPreffered;
                prefferedChance = rPrefferedChance;
                chanceOfPrefferedSelecting = rChanceOfPrefferedSelecting;
            }
        })

        return {
            preffered: preffered,
            prefferedChance: prefferedChance,
            chanceOfPrefferedSelecting: chanceOfPrefferedSelecting
        }
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
        bot.behaviors.looking.lookAtEntity(bot.behaviors.looking.target)
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
            
            let {preffered, prefferedChance, chanceOfPrefferedSelecting} = bot.behaviors.looking.preferSelect()

            let parts = Object.values(bot.entities).filter((entity) => {
                return entity != preffered && 
                (preffered == null ? true : entity.username != preffered.username) && 
                entity.username != bot.username &&
                bot.player.entity.position.distanceTo(entity.position) <= 5.0
            })

            if(preffered == null) {
                if(parts.length != 0) {
                    pos = Math.floor(Math.random() * parts.length)
                    selected = parts[pos]
                }
            } else {
                if(Math.random() < prefferedChance || parts.length == 0) {
                    selected = preffered
                } else {
                    pos = Math.floor(Math.random() * parts.length)
                    selected = parts[pos]
                }
            }

            if((Math.random() < (selected == preffered ? chanceOfPrefferedSelecting : chanceOfSelecting)) && selected != null) {
                console.log('Started looking at!')
                currentCycle = 0
                lookToFar = 0
                bot.behaviors.looking.target = selected
                lookTimeout = setInterval(look, 50)
            } else {
                console.log(`not intrested in selected! Change of interest was ${(selected == preffered ? chanceOfPrefferedSelecting : chanceOfSelecting)}`)
            }
        }
    }
    
    lookPoll = setInterval(lookingPolling, 500)
}

module.exports = add