const workerRequire = require('./role_worker')

const isNeed = (creepMemory) => !!Game.flags[creepMemory.config.flagName]

const prepare = function (creep) {
    if (creep.ticksToLive < (creep.room.name === creep.memory.home ? 100 : 200)) return creep.suicide()

    if (!creep.gotoFlag(creep.memory.config.flagName)) return false

    const mineral = Game.flags[creep.memory.config.flagName].pos.mineral
    if (!mineral) {
        creep.say('no mineral!')
        creep.memory.dontNeed = true
        return false
    }
    creep.memory.mineralId = mineral.id
    return true
}

const source = function (creep) {
    if (creep.ticksToLive < (creep.room.name === creep.memory.home ? 100 : 200)) {
        if (!creep.isEmpty) return true
        else return creep.suicide()
    }

    if (creep.isFull) return true
    const result = creep.getFrom(Game.getObjectById(creep.memory.mineralId))
    if (result === ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.dontNeed = true
        if (!creep.isEmpty) return true
        else return creep.suicide()
    }
}

const target = function (creep) {
    if (creep.isEmpty) {
        creep.memory.ready = false
        return true
    }
    if (!creep.goBackHome()) return false
    creep.putTo(creep.room.storage || creep.room.terminal, Object.keys(creep.store)[0])
}

const bodys = workerRequire.bodys

module.exports = { isNeed, prepare, source, target, bodys }
