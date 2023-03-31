const TASK_TYPE = 'TaskTransport'

const isNeed = function (memory) {
    Game.rooms[memory.home].updateTaskUnit(TASK_TYPE, memory.task.key, -1)
    return !memory.dontNeed
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 50) return false
    if (creep.memory.working) {
        if (!creep.room.memory.spawnLock) creep.room.memory.spawnLock = Game.time + creep.ticksToLive + 2
        return false
    }
    if (!creep.clearCarry()) return true
    creep.room.memory.spawnLock = Game.time + 2
    creep.suicide()
    return true
}

const source = (creep) => creep.runTaskSource(TASK_TYPE)

const target = (creep) => creep.runTaskTarget(TASK_TYPE)

const bodys = [
    [ [CARRY, MOVE], 1 ],
    [ [CARRY, CARRY, MOVE], 3 ],
    [ [CARRY, CARRY, MOVE], 5 ],
    [ [CARRY, CARRY, MOVE], 8 ],
    [ [CARRY, CARRY, MOVE], 12 ],
    [ [CARRY, CARRY, MOVE], 15 ],
    [ [CARRY, CARRY, MOVE], 16 ],
    [ [CARRY, CARRY, MOVE], 16 ]
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
