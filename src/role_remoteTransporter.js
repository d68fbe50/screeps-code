const TASK_TYPE = 'TaskRemote'

const transporterRequire = require('./role_transporter')

const isNeed = (creepMemory) => {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task.key, -1)
    return !creepMemory.dontNeed
}

const source = (creep) => {
    if (creep.ticksToLive < 50) return creep.clearCarry() && creep.suicide()
    return creep.runTaskSource(TASK_TYPE, 'sourceType')
}

const target = (creep) => creep.runTaskTarget(TASK_TYPE, 'sourceType')

const bodys = transporterRequire.bodys

module.exports = { isNeed, source, target, bodys }
