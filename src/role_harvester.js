const source = function(creep) {
    if (creep.store.getFreeCapacity() === 0) return true

    creep.harvest(creep.room.source[0])
}

const target = function(creep) {
    if (creep.store.getUsedCapacity() === 0) return true

    creep.upgradeController(creep.room.controller)
}

module.exports = { source, target }
