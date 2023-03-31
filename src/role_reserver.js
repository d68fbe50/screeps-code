const isNeed = function (creepMemory) {
    const flag = Game.flags[creepMemory.config.flagName]
    if (!flag) return false
    return Game.time > Game.rooms[creepMemory.home].memory.remoteLocks[flag.pos.roomName]
}

const prepare = (creep) => creep.gotoFlagRoom(creep.memory.config.flagName)

const target = function (creep) {
    if (creep.hits < creep.hitsMax && !Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name]) {
        Game.rooms[creep.memory.home].memory.remoteLocks[creep.room.name] = Game.time + 1500
        creep.memory.dontNeed = true
    }
    creep.reserve()
}

const bodys = [
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 2 ],
    [ [MOVE, CLAIM], 2 ],
    [ [MOVE, CLAIM], 3 ],
    [ [MOVE, CLAIM], 3 ],
    [ [MOVE, CLAIM], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
