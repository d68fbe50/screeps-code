const workerRequire = require('./role_worker')

const isNeed = () => false

const source = (creep) => {
    if (creep.ticksToLive < 100) {
        if (!creep.isEmpty) return true
        else return creep.suicide()
    }
    if (creep.isFull) return true
    const result = creep.getFrom(creep.room.mineral, creep.room.mineralType)
    if (result === ERR_NOT_ENOUGH_RESOURCES) {
        if (!creep.isEmpty) return true
        else return creep.suicide()
    }
}

const target = (creep) => creep.clearCarry()

const bodys = workerRequire.bodys

module.exports = { isNeed, source, target, bodys }
