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
    if (!creep.clearResources()) return true
    creep.room.memory.spawnLock = Game.time + 2
    creep.suicide()
    return true
}

const source = (creep) => creep.runTaskSource(TASK_TYPE)

const target = (creep) => creep.runTaskTarget(TASK_TYPE)

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

module.exports = { isNeed, deathPrepare, source, target, bodys }
