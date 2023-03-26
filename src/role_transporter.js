const TASK_TYPE = 'TaskTransport'
const taskActions = require('./task_transportActions')

const isNeed = function (creepMemory, creepName) {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.taskKey, -1)
    if (!creepMemory.dontNeed) return true
    Memory.rooms[creepMemory.home].transporters = _.pull(Memory.rooms[creepMemory.home].transporters, creepName)
    return false
}

const prepare = function (creep) {
    if (!Memory.rooms[creep.room.name].transporters.includes(creep.name)) Memory.rooms[creep.room.name].transporters.push(creep.name)
    return true
}

const source = function (creep) {
    if (creep.ticksToLive < 30) {
        creep.room.memory.spawnLock = Game.time + 2
        return creep.suicide()
    }
    if (creep.room.memory[TASK_TYPE].length === 0) return false

    let task = creep.room.getTask(TASK_TYPE, creep.memory.taskKey)
    if (!task) {
        task = creep.receiveTask(TASK_TYPE)
        if (!task) return false
    }

    if (!creep.memory.taskBegin || Game.time - creep.memory.taskBegin > 100) {
        creep.revertTask(TASK_TYPE)
        return false
    }

    const action = taskActions[task.key]
    if (!action || !action.source) {
        creep.log(`任务逻辑不存在：${task.key}`, 'error')
        return false
    }
    return action.source(creep)
}

const target = function (creep) {
    if (creep.ticksToLive < 30 && !creep.room.memory.spawnLock) creep.room.memory.spawnLock = Game.time + creep.ticksToLive + 2

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
    { carry: 1, move: 1 },
    { carry: 5, move: 5 },
    { carry: 10, move: 5 },
    { carry: 16, move: 8 },
    { carry: 24, move: 12 },
    { carry: 30, move: 15 },
    { carry: 32, move: 16 },
    { carry: 32, move: 16 }
]

module.exports = { isNeed, prepare, source, target, bodys }
