const isNeed = function (creepMemory, creepName) {
    if (!creepMemory.dontNeed) return true
    Memory.rooms[creepMemory.home].workerList = _.pull(Memory.rooms[creepMemory.home].workerList, creepName)
    return false
}

const prepare = function (creep) {
    if (!Memory.rooms[creep.room.name].workerList.includes(creep.name)) Memory.rooms[creep.room.name].workerList.push(creep.name)
    return true
}

const source = function (creep) {
    if (creep.store.getFreeCapacity() === 0) return true
    //
}

const target = function (creep) {
    if (creep.store.getUsedCapacity() === 0) return true
    //
}

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

module.exports = { isNeed, prepare, source, target, bodys }
