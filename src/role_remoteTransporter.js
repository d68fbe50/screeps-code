const TASK_TYPE = 'TaskRemote'

const isNeed = function (memory) {
    Game.rooms[memory.home].updateTaskUnit(TASK_TYPE, memory.task.key, -1)
    return false
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
    { carry: 3, move: 3 },
    { carry: 5, move: 5 },
    { carry: 8, move: 8 },
    { carry: 13, move: 13 },
    { carry: 18, move: 18 },
    { carry: 23, move: 23 },
    { carry: 25, move: 25 },
    { carry: 25, move: 25 }
]

module.exports = { isNeed, deathPrepare, source, target, bodys }
