const { Vec3 } = require('vec3')
const { RaycastIterator } = require('prismarine-world').iterators
const mc = require('minecraft-protocol')
const { testedVersions, latestSupportedVersion, oldestSupportedVersion } = require('mineflayer')

function getViewDirection (pitch, yaw) {
    const csPitch = Math.cos(pitch)
    const snPitch = Math.sin(pitch)
    const csYaw = Math.cos(yaw)
    const snYaw = Math.sin(yaw)
    return new Vec3(-snYaw * csPitch, snPitch, -csYaw * csPitch)
}

function entityAtEntityCursor(bot, sightEntity, maxDistance=3.5, matcher=null) {
    if(sightEntity == null)
        return null;
    const block = bot.blockAtEntityCursor(sightEntity, maxDistance, matcher)
    maxDistance = block?.intersect.distanceTo(sightEntity.position) ?? maxDistance

    const entities = Object.values(bot.entities)
      .filter(entity => entity.type !== 'object' && entity != sightEntity && entity.position.distanceTo(sightEntity.position) <= maxDistance)

    const dir = getViewDirection(sightEntity.pitch, sightEntity.yaw)
    const iterator = new RaycastIterator(sightEntity.position.offset(0, sightEntity.eyeHeight, 0), dir.normalize(), maxDistance)

    let targetEntity = null
    let targetDist = maxDistance

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const w = entity.width / 2

      const shapes = [[-w, 0, -w, w, entity.height, w]]
      const intersect = iterator.intersect(shapes, entity.position)
      if (intersect) {
        const entityDir = entity.position.minus(sightEntity.position) // Can be combined into 1 line
        const sign = Math.sign(entityDir.dot(dir))
        if (sign !== -1) {
          const dist = sightEntity.position.distanceTo(intersect.pos)
          if (dist < targetDist) {
            targetEntity = entity
            targetDist = dist
          }
        }
      }
    }
    return targetEntity
}

function isEntityLookingAtBot(bot, entity) {
    return entityAtEntityCursor(bot, entity, 5.0) == bot.player.entity
}

async function attackPlayer (bot, username) {
    const player = bot.players[username]
    if (!player || !player.entity) {
        bot.chat('No player to attack')
    } else {
        var step;
        for (step = 0; step < 5; step++) {
            bot.chat(`Attacking ${player.username}`)
            bot.attack(player.entity)
            await sleep(500)
        }
    }
}

function attackEntity(bot) {
    const entity = bot.nearestEntity()
    if (!entity) {
        bot.chat('No entity to attack')
    } else {
        bot.chat(`Found entity ${entity.name ?? entity.username}`)
        bot.attack(entity)
    }
}

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function createConsole(console, name) {
    nwConsole = {};
    nwConsole.log = (message, ...args) => {
        if(args != null && args.length != 0)
            console.log(`[${name}] ${message}`, args)
        else
            console.log(`[${name}] ${message}`)
    }
    nwConsole.error = (message, ...args) => {
        if(args != null && args.length != 0)
            console.log(`[${name}] ${message}`, args)
        else
            console.log(`[${name}] ${message}`)
    }

    return nwConsole
}




module.exports = {
    entityAtEntityCursor: entityAtEntityCursor,
    attackPlayer: attackPlayer,
    attackEntity: attackEntity,
    createConsole: createConsole,
    isEntityLookingAtBot: isEntityLookingAtBot
}