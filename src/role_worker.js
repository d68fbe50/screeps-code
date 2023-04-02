const TASK_TYPE = 'TaskWork'

const isNeed = (creepMemory) => {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task.key, -1)
    return !creepMemory.dontNeed
}

const source = (creep) => {
    if (creep.ticksToLive < 50) return creep.suicide()
    return creep.runTaskSource(TASK_TYPE)
}

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

module.exports = { isNeed, source, target, bodys }
