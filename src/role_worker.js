const TASK_TYPE = 'TaskWork'
const taskActions = require("./task_workActions");

const isNeed = function (creepMemory) {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task && creepMemory.task.key, -1)
    return !creepMemory.dontNeed;
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 30 || creep.memory.working) return false
    if (!creep.clearResources()) return true
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
    { work: 1, carry: 1, move: 1 },
    { work: 2, carry: 2, move: 2 },
    { work: 4, carry: 4, move: 4 },
    { work: 6, carry: 6, move: 6 },
    { work: 9, carry: 9, move: 9 },
    { work: 11, carry: 11, move: 11 },
    { work: 16, carry: 16, move: 16 },
    { work: 16, carry: 16, move: 16 }
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
