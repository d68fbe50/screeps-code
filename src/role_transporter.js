const TASK_TYPE = 'TaskTransport'
const taskActions = require('./task_transportActions')

const isNeed = function (creepMemory) {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task && creepMemory.task.key, -1)
    return !creepMemory.dontNeed;
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 30) return false
    if (creep.memory.working) {
        if (!creep.room.memory.spawnLock) creep.room.memory.spawnLock = Game.time + creep.ticksToLive + 2
        return false
    }
    if (!creep.clearResources()) return true
    creep.room.memory.spawnLock = Game.time + 2
    creep.suicide()
    return true
}

const source = function (creep) {
    if (creep.room.memory[TASK_TYPE].length === 0) {
        creep.memory.task = {}
        return false
    }
    if (!creep.memory.task.key) {
        if (!creep.receiveTask(TASK_TYPE)) return false
    }
    const task = creep.room.getTask(TASK_TYPE, creep.memory.task.key)
    if (!task) {
        creep.memory.task = {}
        return false
    }
    const action = taskActions[task.key]
    if (!action || !action.source) {
        creep.log(`${TASK_TYPE}:source 任务逻辑不存在：${task.key}`, 'error')
        return false
    }
    return action.source(creep)
}

const target = function (creep) {
    const task = creep.room.getTask(TASK_TYPE, creep.memory.task.key)
    if (!task) {
        creep.memory.task = {}
        return true
    }
    const action = taskActions[task.key]
    if (!action || !action.target) {
        creep.log(`${TASK_TYPE}:target 任务逻辑不存在：${task.key}`, 'error')
        return true
    }
    const result = action.target(creep)
    if (result) creep.revertTask(TASK_TYPE)
    return result
}

const bodys = [
    { carry: 1, move: 1 },
    { carry: 5, move: 5 },
    { carry: 10, move: 5 },
    { carry: 16, move: 8 },
    { carry: 24, move: 12 },
    { carry: 30, move: 15 },
    { carry: 32, move: 16 },
    { carry: 32, move: 16 }
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
