const TASK_TYPE = 'TaskCenter'

const prepare = function (creep) {
    const { centerPosX, centerPosY } = creep.memory.config
    if (centerPosX && centerPosY) {
        if (creep.pos.x !== centerPosX || creep.pos.y !== centerPosY) {
            creep.moveTo(centerPosX, centerPosY)
            return false
        }
    }
    return true
}

const source = function (creep) {
    if (creep.ticksToLive <= 5) return false
    if (creep.room.memory.TaskCenter.length === 0) return false
    if (!creep.clearResources()) return false

    const task = creep.room.getFirstTask(TASK_TYPE)
    if (!task) return false
    const key = task.key
    const { source, resourceType, amount } = task.data
    creep.memory.taskKey = key

    let getAmount = creep.store.getFreeCapacity()
    if (getAmount > amount) getAmount = amount

    const result = creep.getFrom(creep.room[source], resourceType, getAmount)
    if (result === OK || result === ERR_FULL) return true
    else if (result === ERR_NOT_ENOUGH_RESOURCES) creep.room.removeTask(TASK_TYPE, key)
    else if (result === ERR_NOT_IN_RANGE) return false
    else {
        creep.room.removeTask(TASK_TYPE, key)
        creep.log(`source 阶段异常，错误码 ${result}，任务数据 ${JSON.stringify(task)}`, 'error')
    }

    return false
}

const target = function (creep) {
    const task = creep.room.getTask(TASK_TYPE, creep.memory.taskKey)
    if (!task) return true
    const key = task.key
    const { target, resourceType } = task.data
    
    const putAmount = creep.store[resourceType]
    const result = creep.putTo(creep.room[target], resourceType)

    if (result === OK) {
        creep.room.handleCenterTask(key, putAmount)
        return true
    } else if (result === ERR_NOT_ENOUGH_RESOURCES) return true
    else if (result === ERR_NOT_IN_RANGE) return false
    else if (result === ERR_FULL) {
        creep.room.removeTask(TASK_TYPE, key)
        target !== 'centerLink' && creep.log(`${target} 满了，请尽快处理`, 'warning')
    } else {
        creep.room.removeTask(TASK_TYPE, key)
        creep.log(`target 阶段异常，错误码 ${result}，任务数据 ${JSON.stringify(task)}`, 'error')
    }

    return false
}

const bodys = [ // 5 级出 link 前用不到
    { carry: 1, move: 1 },
    { carry: 1, move: 1 },
    { carry: 1, move: 1 },
    { carry: 1, move: 1 },
    { carry: 16, move: 1 },
    { carry: 16, move: 1 },
    { carry: 16, move: 1 },
    { carry: 16, move: 1 }
]

module.exports = { prepare, source, target, bodys }
