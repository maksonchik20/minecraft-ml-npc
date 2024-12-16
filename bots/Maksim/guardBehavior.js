const {guardArea, moveToGuardPos, stopGuarding} = require('./guard')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')


function add(bot) {
    bot.guardPos = null
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    // Called when the bot has killed it's target.
    bot.on('stoppedAttacking', () => {
        if (bot.guardPos) {
            console.log("stoppedAttacking");
            moveToGuardPos(bot)
        }
    })

    // Check for new enemies to attack
    bot.on('physicsTick', () => {
        console.log(`Before start. !guardPos=${!bot.guardPos}.`)
        if (!bot.guardPos) return // Do nothing if bot is not guarding anything
    
        // Only look for mobs within 16 blocks
        // const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
        // e.displayName !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?
        const filter2 = e => e.name.toLowerCase() == 'mob'
        const entity = bot.nearestEntity(filter2)
        console.log(`After start. !guardPos=${!bot.guardPos}. entity: ${entity}`)
        if (entity) {
            // Start attacking
            bot.pvp.attack(entity)
        }
    })
  
    // Listen for player commands
    bot.on('chat', (username, message) => {
        // Guard the location the player is standing
        if (message === 'hello') {
            bot.chat('hello bro')
        }
        if (message === 'guard') {
            const player = bot.players[username]

            if (!player) {
                bot.chat("I can't see you.")
                return
            }

            bot.chat('I will guard that location.')
            guardArea(bot, player.entity.position)
        }

        // Stop guarding
        if (message === 'stop') {
            bot.chat('I will no longer guard this area.')
            stopGuarding(bot)
        }
    })
}

module.exports = add