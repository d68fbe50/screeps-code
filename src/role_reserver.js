const isNeed = function (creepMemory) {
    return !!Game.flags[creepMemory.config.flagName]
}

const prepare = function (creep) {
    const flag = Game.flags[creep.memory.config.flagName]
    if (!flag) {
        creep.log('no flag!', 'error')
        return false
    }
    if (creep.room.name !== flag.pos.roomName) {
        creep.moveTo(flag)
        return false
    }
    return true
}

const target = function (creep) {
    if (creep.hits < creep.hitsMax && !creep.room.memory.remoteLock) {
        creep.room.memory.remoteLock = Game.time + 1500
        creep.memory.dontNeed = true
        // TODO: add delayTask
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
