const transportTaskActions = require('./task_transport')

const isNeed = function (creepMemory, creepName) {
    if (!creepMemory.dontNeed) return true
    Memory.rooms[creepMemory.home].transporterList = _.pull(Memory.rooms[creepMemory.home].transporterList, creepName)
    return false
}

const prepare = function (creep) {
    if (!Memory.rooms[creep.room.name].transporterList.includes(creep.name)) Memory.rooms[creep.room.name].transporterList.push(creep.name)
    return true
}

const source = function (creep) {
    if (creep.ticksToLive < 30) {
        creep.room.memory.lockSpawn = Game.time + 2
        return creep.suicide()
    }
    const taskKey = creep.memory.taskKey
    if (!taskKey) return false
    const task = creep.room.getTransportTask(taskKey)
    if (!task) return false
    const action = transportTaskActions[taskKey]
    if (!action || !action.source) {
        creep.log(`任务逻辑不存在：${taskKey}`, 'error')
        return false
    }
    return action.source(creep)
}

const target = function (creep) {
    if (creep.ticksToLive < 30 && !creep.room.memory.lockSpawn) creep.room.memory.lockSpawn = Game.time + creep.ticksToLive + 2
    const taskKey = creep.memory.taskKey
    if (!taskKey) return true
    const task = creep.room.getTransportTask(taskKey)
    if (!task) return true
    const action = transportTaskActions[taskKey]
    if (!action || !action.target) {
        creep.log(`任务逻辑不存在：${taskKey}`, 'error')
        return true
    }
    return action.target(creep)
}

const bodys = [
    { carry: 3, move: 3 },
    { carry: 5, move: 5 },
    { carry: 10, move: 5 },
    { carry: 16, move: 8 },
    { carry: 24, move: 12 },
    { carry: 30, move: 15 },
    { carry: 32, move: 16 },
    { carry: 32, move: 16 }
]

module.exports = { isNeed, prepare, source, target, bodys }
