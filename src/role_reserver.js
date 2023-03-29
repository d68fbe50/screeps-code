const isNeed = function (creepMemory) {
    const flag = Game.flags[creepMemory.config.flagName]
    if (!flag) return false
    return Game.time > Game.rooms[creepMemory.home].memory.remoteLocks[flag.pos.roomName]
}

const prepare = function (creep) {
    return creep.gotoFlagRoom(creep.memory.config.flagName)
}

const target = function (creep) {
    if (creep.hits < creep.hitsMax && !Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name]) {
        Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name] = Game.time + 1500
        creep.memory.dontNeed = true
    }
    creep.reserve()
}

const bodys = [
    { move: 1, claim: 1 },
    { move: 1, claim: 1 },
    { move: 1, claim: 1 },
    { move: 2, claim: 2 },
    { move: 2, claim: 2 },
    { move: 3, claim: 3 },
    { move: 3, claim: 3 },
    { move: 3, claim: 3 }
]

module.exports = { isNeed, prepare, target, bodys }
