const TASK_TYPE = 'TaskWork'
const taskActions = require("./task_work");

const isNeed = function (creepMemory, creepName) {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.taskKey, -1)
    if (!creepMemory.dontNeed) return true
    Memory.rooms[creepMemory.home].workerList = _.pull(Memory.rooms[creepMemory.home].workerList, creepName)
    return false
}

const prepare = function (creep) {
    if (!Memory.rooms[creep.room.name].workerList.includes(creep.name)) Memory.rooms[creep.room.name].workerList.push(creep.name)
    return true
}

const source = function (creep) {
    if (creep.ticksToLive < 30) return creep.suicide()
    if (creep.room.memory[TASK_TYPE].length === 0) return false

    let task = creep.room.getTask(TASK_TYPE, creep.memory.taskKey)
    if (!task) {
        task = creep.room.getExpectTask(TASK_TYPE)
        if (task) {
            creep.memory.taskKey = task.key
            creep.room.updateTaskUnit(TASK_TYPE, creep.memory.taskKey, 1)
        } else {
            creep.room.updateTaskUnit(TASK_TYPE, creep.memory.taskKey, -1)
            delete creep.memory.taskKey
            return false
        }
    }

    const action = taskActions[task.key]
    if (!action || !action.source) {
        creep.log(`任务逻辑不存在：${task.key}`, 'error')
        return false
    }
    return action.source(creep)
}

const target = function (creep) {
    const task = creep.room.getTask(TASK_TYPE, creep.memory.taskKey)
    if (!task) return true

    const action = taskActions[task.key]
    if (!action || !action.target) {
        creep.log(`任务逻辑不存在：${task.key}`, 'error')
        return true
    }
    return action.target(creep)
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

module.exports = { isNeed, prepare, source, target, bodys }
