const TASK_TYPE = 'TaskCenter'

const prepare = (creep) => {
    if (!creep.room.centerPos) return true
    if (creep.pos.isEqualTo(creep.room.centerPos)) {
        creep.memory.dontPullMe = true
        return true
    }
    creep.goto(creep.room.centerPos)
    return false
}

const source = (creep) => {
    if (creep.ticksToLive <= 5) return false
    if (creep.room.memory.TaskCenter.length === 0) return false
    if (!creep.clearCarry()) return false

    const task = creep.room.getFirstTask(TASK_TYPE)
    if (!task) return false
    const key = task.key
    const { source, resourceType, amount } = task.data
    creep.memory.task.key = key

    let getAmount = creep.freeCapacity
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

const target = (creep) => {
    const task = creep.room.getTask(TASK_TYPE, creep.memory.task.key)
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

const bodys = [
    [ [MOVE], 1, [CARRY], 1 ],
    [ [MOVE], 1, [CARRY], 1 ],
    [ [MOVE], 1, [CARRY], 1 ],
    [ [MOVE], 1, [CARRY], 1 ],
    [ [MOVE], 1, [CARRY], 16 ],
    [ [MOVE], 1, [CARRY], 16 ],
    [ [MOVE], 1, [CARRY], 16 ],
    [ [MOVE], 1, [CARRY], 16 ]
]

module.exports = { prepare, source, target, bodys }
