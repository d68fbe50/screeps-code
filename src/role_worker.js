const TASK_TYPE = 'TaskWork'

const isNeed = function (memory) {
    Game.rooms[memory.home].updateTaskUnit(TASK_TYPE, memory.task.key, -1)
    return !memory.dontNeed
}

const deathPrepare = function (creep) {
    if (!creep.ticksToLive || creep.ticksToLive > 50 || creep.memory.working) return false
    if (!creep.clearResources()) return true
    creep.suicide()
    return true
}

const source = (creep) => creep.runTaskSource(TASK_TYPE)

const target = (creep) => creep.runTaskTarget(TASK_TYPE)

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

module.exports = { isNeed, deathPrepare, source, target, bodys }
