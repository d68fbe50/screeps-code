const workerRequire = require('./role_worker')

const isNeed = (creepMemory) => !!Game.flags[creepMemory.config.flagName]

const prepare = (creep) => creep.gotoFlagRoom(creep.memory.config.flagName)

const source = (creep) => creep.getEnergy()

const target = function (creep) {
    if (creep.isEmpty) {
        delete creep.memory.dontPullMe
        return true
    }
    if (creep.room.getTransportTask('fillExtension')) {
        if (creep.fillExtensions()) creep.room.removeTask('TaskTransport', 'fillExtension')
        else return false
    }
    if (creep.room.getTransportTask('fillTower')) {
        if (creep.fillTowers()) creep.room.removeTask('TaskTransport', 'fillTower')
        else return false
    }
    if (creep.room.getTask('TaskWork', 'build')) {
        if (creep.buildStructure()) creep.room.removeTask('TaskWork', 'build')
        else {
            creep.memory.dontPullMe = true
            return false
        }
    }
    creep.upgrade() === OK && (creep.memory.dontPullMe = true)
}

const bodys = workerRequire.bodys

module.exports = { isNeed, prepare, source, target, bodys }
