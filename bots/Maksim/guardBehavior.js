const {guardArea, moveToGuardPos, stopGuarding} = require('./guard')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder } = require('mineflayer-pathfinder')


function add(console, bot) {
    bot.guardPos = null
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)

    bot.on('stoppedAttacking', () => {
        console.log(`stoppedAttacking ${bot.guardPos}`)
        if (bot.guardPos) {
            moveToGuardPos(bot)
        }
    })

    bot.on('physicsTick', () => {
        if (!bot.guardPos) return
        let filter
        if (bot.protect_player) {
            filter = (entity) => {
                return entity.type == 'hostile' &&
                entity.position.distanceTo(bot.players['maksonchik20'].entity.position) < 16 &&
                entity.displayName !== 'Armor Stand'
            }
        } else {
            // todo: искать близжайшего к bot.protect_player (хранить тут player).
            filter = (entity) => {
                return entity.type == 'hostile' &&
                entity.position.distanceTo(bot.players['maksonchik20'].entity.position) < 16 &&
                entity.displayName !== 'Armor Stand'
            }
        }
        const entity = bot.nearestEntity(filter)
        
        if (entity) {
            bot.pvp.attack(entity)
        }
    })
  
    bot.on('chat', (username, message) => {
        if (username == bot.username) return
        
        if (message === 'guard') {
            const player = bot.players[username]

            if (!player) {
                bot.chat("I can't see you.")
                return
            }
            if (bot.behaviors.follow.target != null) {
                bot.chat('I will protect you.')
                guardArea(bot, player.entity.position, true)
            } else {
                bot.chat('I will guard that location.')
                guardArea(bot, player.entity.position, false)
            }
        }

        if (message === 'stop') {
            bot.chat('I will no longer guard this area.')
            stopGuarding(bot)
        }
    })
}

module.exports = add