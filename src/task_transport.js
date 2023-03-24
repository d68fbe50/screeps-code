function getEnergy(creep) {
    if (creep.store[RESOURCE_ENERGY] / creep.store.getCapacity() > 0.5) return true
    if (!creep.clearResources(RESOURCE_ENERGY)) return false
    creep.getFrom(creep.room.terminal) // TODO
    return false
}

const fillExtension = {
    source: (creep) => getEnergy(creep),
    target: (creep) => {
        if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) return creep.room.removeTransportTask(creep.memory.taskKey)
        if (creep.store[RESOURCE_ENERGY] === 0) return true
        let target = Game.getObjectById(creep.memory.needFillSpawnExtId)
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = creep.pos.findClosestByRange([...creep.room.spawn, ...creep.room.extension], { filter: i => i.store.getFreeCapacity(RESOURCE_ENERGY) > 0 })
            creep.memory.needFillSpawnExtId = target.id // target 一定存在
        }
        creep.putTo(target)
        return false
    }
}

const fillTower = {
    source: (creep) => getEnergy(creep),
    target: (creep) => {
        if (creep.store[RESOURCE_ENERGY] === 0) return true
        let target = Game.getObjectById(creep.memory.needFillTowerId)
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = creep.pos.findClosestByRange(creep.room.tower, { filter: i => i.store[RESOURCE_ENERGY] < 800 })
            if (!target) return creep.room.removeTransportTask(creep.memory.taskKey)
            creep.memory.needFillTowerId = target.id
        }
        creep.putTo(target)
        return false
    }
}

const labEnergy = {}

const labIn = {}

const labOut = {}

const nukerEnergy = {}

const nukerG = {}

const powerSpawnEnergy = {}

const powerSpawnPower = {}

module.exports = { fillExtension, fillTower, labEnergy, labIn, labOut, nukerEnergy, nukerG, powerSpawnEnergy, powerSpawnPower }
