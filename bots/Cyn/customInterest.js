const { isEntityLookingAtBot } = require("../../modules/functions");


function add(console, bot) {
    bot.removeAllListeners('chat');

    let cyclePoll = undefined;

    let interestedEntities = []
    const defaultInterest = 30

    function isEntityIntrested(entity) {
        if(bot.behaviors.follow.isFollowingEntity(entity))
            return true;
        return interestedEntities.filter((interest) => {
            return (interest.entity == entity || interest.entity.username == entity.username)
        }).length != 0
    }

    function updateInterest(entity) {
        let result = false
        interestedEntities.filter((interest) => {
            return (interest.entity == entity || interest.entity.username == entity.username)
        })
        .forEach((interest) => {
            result = true
            interest.cycles = defaultInterest;
        })
        return result;
    }

    function addInterest(entity) {
        if(updateInterest(entity)) return
        console.log('Entity is interest in me!')
        interestedEntities.push({
            cycles: defaultInterest,
            entity: entity
        })
    }

    function removeInterest(entity) {
        console.log('Entity no longer interest in me!')
        interestedEntities = interestedEntities.filter((interest) => {
            return !(interest.entity == entity || interest.entity.username == entity.username)
        })
    }

    function checkLookInterest(entity) {
        if(isEntityLookingAtBot(bot, entity)) {
            addInterest(entity)
            setTimeout(() => {
                checkLookInterest(entity)
            }, 100)
        }
    }

    bot.behaviors.looking.preferSelectingFuncs.push(() => {
        let preffered = null;
        let prefferedChance = 0.6;
        let chanceOfPrefferedSelecting = 0.8;

        interestedEntities.forEach((value) => {
            if(value.entity == undefined)
                return
            if(value.entity.username === bot.username)
                return
            if(bot.player.entity.position.distanceTo(value.entity.position) < 5.0) {
                console.log('Interest back!')
                if(preffered == null) {
                    preffered = value.entity;
                    return;
                } else if (bot.player.entity.position.distanceTo(preffered.position) > bot.player.entity.position.distanceTo(value.entity.position)){
                    preffered = value.entity;
                    return;
                }
            }
        })

        return {
            preffered: preffered,
            prefferedChance: prefferedChance,
            chanceOfPrefferedSelecting: chanceOfPrefferedSelecting
        }
    })

    bot.on('chat', (username, message) => {
        if (message.includes(bot.username) && bot.players[username].entity) {
            setTimeout(() => {
                addInterest(bot.players[username].entity)
            }, Math.random() * 100)
        }
        if (message.includes('come with me') && (message.includes(bot.username) || isEntityIntrested(bot.players[username].entity))) {
            console.log('start following ' + username)
            bot.chat('Following you!');
            let target = bot.players[username]?.entity
            if(target !== undefined) {
                bot.behaviors.follow.startFollowing(target)
            }
        }
        if (message.includes('stop following') && (message.includes(bot.username) || isEntityIntrested(bot.players[username].entity))) {
            console.log('stop following')
            bot.chat('Ok!');
            bot.behaviors.follow.stopFollowing()
        }
    })

    cyclePoll = setInterval(() => {
        let toPop = []
        interestedEntities.forEach((interest) => {
            interest.cycles--;
            if(interest.cycles == 0)
                toPop.push(interest.entity)
        })
        toPop.forEach((entity) => {
            removeInterest(entity);
        })
    }, 100)

    let longCyclePoll = setInterval(() => {
        let val = Object.values(bot.entities).filter((entity) => { return entity.username != bot.username })
        val.forEach(entity => {
            if(isEntityLookingAtBot(bot, entity) && !isEntityIntrested(entity)) {
                setTimeout(() => {
                    checkLookInterest(entity)
                }, 100)
            }
        })
    }, 800)

    bot.on('end', () => {
        clearInterval(longCyclePoll)
        clearInterval(cyclePoll)
    })
}

module.exports = add