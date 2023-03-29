const workerRequire = require('./role_worker')

const isNeed = function (creepMemory) {
    const flag = Game.flags[creepMemory.config.flagName]
    return flag && flag.room && flag.room.level < 3
}

const prepare = function (creep) {
    return creep.gotoFlagRoom(creep.memory.config.flagName)
}

const source = function (creep) {
    return creep.getEnergy()
}

const target = function (creep) {
    if (creep.isEmpty) return true
    creep.fillExtensions() || creep.buildStructure() || creep.upgrade()
}

const bodys = workerRequire.bodys

module.exports = { isNeed, prepare, source, target, bodys }
