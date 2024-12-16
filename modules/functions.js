const { Vec3 } = require('vec3')
const { RaycastIterator } = require('prismarine-world').iterators

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

async function attackPlayer(bot, username) {
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

function guardArea(pos) {
  guardPos = pos
  if (!bot.pvp.target) {
    moveToGuardPos()
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    entityAtEntityCursor: entityAtEntityCursor,
    attackPlayer: attackPlayer,
    attackEntity: attackEntity
}