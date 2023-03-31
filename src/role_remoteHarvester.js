const harvesterRequire = require('./role_harvester')

const isNeed = function (creepMemory) {
    const flag = Game.flags[creepMemory.config.flagName]
    if (!flag) return false
    return Game.time > Game.rooms[creepMemory.home].memory.remoteLocks[flag.pos.roomName]
}

const prepare = function (creep) {
    const flag = Game.flags[creep.memory.config.flagName]
    if (creep.hits < creep.hitsMax && creep.room.name === flag.pos.roomName && !Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name]) {
        Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name] = Game.time + 1500
        creep.memory.dontNeed = true
    }
    return harvesterRequire.prepare(creep)
}

const target = function (creep) {
    if (creep.hits < creep.hitsMax && !Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name]) {
        Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name] = Game.time + 1500
        creep.memory.dontNeed = true
    }
    return harvesterRequire.target(creep)
}

const bodys = [
    [ [CARRY], 1, [MOVE, WORK, WORK], 1 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 2 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
