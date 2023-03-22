const source = function (creep) {
    if (creep.store.getFreeCapacity() === 0) return true

    creep.getFrom(Game.getObjectById(creep.memory.config.sourceId))
}

const target = function (creep) {
    if (creep.store.getUsedCapacity() === 0) return true

    creep.upgrade()
}

module.exports = { source, target }
