const workerRequire = require('./role_worker')

const isNeed = function (creepMemory) {
    const targetRoom = Game.rooms[creepMemory.config.roomName]
    return targetRoom && targetRoom.level < 3
}

const prepare = function (creep) {
    const targetRoom = Game.rooms[creep.memory.config.roomName]
    if (!targetRoom) {
        creep.log(`新房间: ${creep.memory.config.roomName} 没了！`, 'error')
        return false
    }
    if (creep.room.name === creep.memory.config.roomName) return true
    creep.goto(targetRoom.controller)
    return false
}

const source = function (creep) {
    return creep.getEnergy()
}

const target = function (creep) {
    if (creep.isEmpty) return true
    if (creep.room.spawn[0] && !creep.room.spawn[0].isFull) {
        creep.putTo(creep.room.spawn[0])
        return false
    }
    creep.buildStructure() || creep.upgrade()
}

const bodys = workerRequire.bodys

module.exports = { isNeed, prepare, source, target, bodys }
