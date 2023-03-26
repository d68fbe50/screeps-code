const harvesterRequire = require('./role_harvester')

const isNeed = function (creepMemory) {
    return !!Game.flags[creepMemory.config.flagName]
}

const prepare = function (creep) {
    const flag = Game.flags[creep.memory.config.flagName]
    if (creep.hits < creep.hitsMax && creep.room.name === flag.pos.roomName && !creep.room.memory.remoteLock) {
        creep.room.memory.remoteLock = Game.time + 1500
        creep.memory.dontNeed = true
    }
    return harvesterRequire.prepare(creep)
}

const target = function (creep) {
    if (creep.hits < creep.hitsMax && !creep.room.memory.remoteLock) {
        creep.room.memory.remoteLock = Game.time + 1500
        creep.memory.dontNeed = true
    }
    return harvesterRequire.target(creep)
}

const bodys = harvesterRequire.bodys

module.exports = { isNeed, prepare, target, bodys }
