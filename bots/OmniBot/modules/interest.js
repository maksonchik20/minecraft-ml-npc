const { isEntityLookingAtBot } = require("../../../modules/functions");

function add(console, bot) {

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
        switch (entity.type) {
            case 'player':
                bot.behaviors.eventPool.addEvent('Сущность', `Игрок "${entity.username}" смотрит на бота или назвал его имя`);
                break;
            case 'animal':
                bot.behaviors.eventPool.addEvent('Сущность', `Животное "${entity.name}" смотрит на бота`);
                break;
            case 'hostile':
                bot.behaviors.eventPool.addEvent('Сущность', `Враждебная сущность "${entity.name}" смотрит на бота`);
                break;
            default:
                bot.behaviors.eventPool.addEvent('Сущность', `Cущность "${entity.name}" смотрит на бота`);
                break;
        }
        
    }

    function removeInterest(entity) {
        switch (entity.type) {
            case 'player':
                bot.behaviors.eventPool.addEvent('Сущность', `Игрок "${entity.username}" больше не смотрит на бота или больше не говорит про него`);
                break;
            case 'animal':
                bot.behaviors.eventPool.addEvent('Сущность', `Животное "${entity.name}" больше не смотрит на бота`);
                break;
            case 'hostile':
                bot.behaviors.eventPool.addEvent('Сущность', `Враждебная сущность "${entity.name}" больше не смотрит на бота`);
                break;
            default:
                bot.behaviors.eventPool.addEvent('Сущность', `Cущность "${entity.name}" больше не смотрит на бота`);
                break;
        }
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

    bot.behaviors.interest.isEntityIntrested = isEntityIntrested

    bot.behaviors.looking.preferSelectingFuncs.push(() => {
        let preffered = null;
        let prefferedCycles = 0;
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
                    prefferedCycles = value.cycles
                    return;
                } else if (value.cycles > prefferedCycles){
                    preffered = value.entity;
                    prefferedCycles = value.cycles
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

    cyclePoll = setInterval(() => {
        let toPop = []
        interestedEntities.forEach((interest) => {
            interest.cycles--;
            if(bot.behaviors.follow.isFollowingEntity(interest.entity))
                interest.cycles = defaultInterest;
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