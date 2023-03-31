const TASK_TYPE = 'TaskRemote'

const transporterRequire = require('./role_transporter')

const isNeed = function (memory) {
    Game.rooms[memory.home].updateTaskUnit(TASK_TYPE, memory.task.key, -1)
    return !memory.dontNeed
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 50 || creep.memory.working) return false
    if (!creep.clearResources()) return true
    creep.suicide()
    return true
}

const source = (creep) => creep.runTaskSource(TASK_TYPE, 'sourceType')

const target = (creep) => creep.runTaskTarget(TASK_TYPE, 'sourceType')

const bodys = transporterRequire.bodys

module.exports = { isNeed, deathPrepare, source, target, bodys }
