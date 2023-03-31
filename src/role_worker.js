const TASK_TYPE = 'TaskWork'

const isNeed = function (creepMemory) {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task.key, -1)
    return !creepMemory.dontNeed
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 50 || creep.memory.working) return false
    if (!creep.clearCarry()) return true
    creep.suicide()
    return true
}

const source = (creep) => creep.runTaskSource(TASK_TYPE)

const target = (creep) => creep.runTaskTarget(TASK_TYPE)

const bodys = [
    [ [WORK, CARRY, MOVE], 1 ],
    [ [WORK, CARRY, MOVE], 2 ],
    [ [WORK, CARRY, MOVE], 4 ],
    [ [WORK, CARRY, MOVE], 6 ],
    [ [WORK, CARRY, MOVE], 9 ],
    [ [WORK, CARRY, MOVE], 11 ],
    [ [WORK, CARRY, MOVE], 16 ],
    [ [WORK, CARRY, MOVE], 16 ]
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
