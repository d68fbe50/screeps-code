const workerRequire = require('./role_worker')

const isNeed = function (creepMemory) {
    return !!Game.flags[creepMemory.config.flagName]
}

const prepare = function (creep) {
    if (creep.ticksToLive < (creep.room.name === creep.memory.home ? 100 : 200)) return creep.suicide()

    const flag = Game.flags[creep.memory.config.flagName]
    if (!flag) {
        creep.log('no flag!', 'error')
        return false
    }
    if (!creep.pos.isNearTo(flag)) {
        creep.moveTo(flag)
        return false
    }
    const mineral = flag.pos.lookFor(LOOK_MINERALS)[0]
    if (!mineral) {
        creep.log('no mineral!', 'error')
        return false
    }
    creep.memory.mineralId = mineral.id
    return true
}

const source = function (creep) {
    if (creep.ticksToLive < (creep.room.name === creep.memory.home ? 100 : 200)) {
        if (creep.store.getUsedCapacity() > 0) return true
        else return creep.suicide()
    }

    if (creep.store.getFreeCapacity() === 0) return true
    const result = creep.getFrom(Game.getObjectById(creep.memory.mineralId))
    if (result === ERR_NOT_ENOUGH_RESOURCES) {
        creep.memory.dontNeed = true
        if (creep.store.getUsedCapacity() > 0) return true
        else return creep.suicide()
    }
}

const target = function (creep) {
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.ready = false
        return true
    }
    creep.putTo(creep.room.terminal || creep.room.storage
        || (Game.rooms[creep.memory.home] && Game.rooms[creep.memory.home].terminal || Game.rooms[creep.memory.home].storage)
        , Object.keys(creep.store)[0])
}

const bodys = workerRequire.bodys

module.exports = { isNeed, prepare, source, target, bodys }
