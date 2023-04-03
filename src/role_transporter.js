const TASK_TYPE = 'TaskTransport'

const isNeed = (creepMemory) => {
    Game.rooms[creepMemory.home].updateTaskUnit(TASK_TYPE, creepMemory.task.key, -1)
    return !creepMemory.dontNeed
}

const source = (creep) => {
    if (creep.ticksToLive < 50) return creep.clearCarry() && creep.suicide() === OK && (creep.room.memory.spawnLock = Game.time + 2)
    return creep.runTaskSource(TASK_TYPE)
}

const target = (creep) => {
    if (creep.ticksToLive < 50 && !creep.room.memory.spawnLock) creep.room.memory.spawnLock = Game.time + creep.ticksToLive + 2
    return creep.runTaskTarget(TASK_TYPE)
}

const bodys = [
    [ [CARRY, MOVE], 1 ],
    [ [CARRY, CARRY, MOVE], 3 ],
    [ [CARRY, CARRY, MOVE], 5 ],
    [ [CARRY, CARRY, MOVE], 8 ],
    [ [CARRY, CARRY, MOVE], 12 ],
    [ [CARRY, CARRY, MOVE], 15 ],
    [ [CARRY, CARRY, MOVE], 15 ],
    [ [CARRY, CARRY, MOVE], 15 ]
]

module.exports = { isNeed, source, target, bodys }
