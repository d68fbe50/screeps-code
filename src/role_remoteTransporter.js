const TASK_TYPE = 'TaskRemote'

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

const source = (creep) => creep.runTaskSource(TASK_TYPE, 'sourceType')

const target = (creep) => creep.runTaskTarget(TASK_TYPE, 'sourceType')

const bodys = [
    { carry: 4, move: 2 },
    { carry: 6, move: 3 },
    { carry: 10, move: 5 },
    { carry: 16, move: 8 },
    { carry: 24, move: 12 },
    { carry: 30, move: 15 },
    { carry: 32, move: 16 },
    { carry: 32, move: 16 }
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
