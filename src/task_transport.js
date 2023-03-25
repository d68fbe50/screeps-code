const fillExtension = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) return creep.room.removeTransportTask(creep.memory.taskKey)
        if (creep.energy === 0) return true
        let target = Game.getObjectById(creep.memory.needFillSpawnExtId)
        if (!target || target.isFull) {
            target = creep.pos.findClosestByRange([...creep.room.spawn, ...creep.room.extension], { filter: s => !s.isFull })
            creep.memory.needFillSpawnExtId = target.id // target 一定存在
        }
        creep.putTo(target)
    }
}

const fillTower = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.energy === 0) return true
        let target = Game.getObjectById(creep.memory.needFillTowerId)
        if (!target || target.isFull) {
            target = creep.pos.findClosestByRange(creep.room.tower, { filter: t => t.energy < 800 })
            if (!target) return creep.room.removeTransportTask(creep.memory.taskKey)
            creep.memory.needFillTowerId = target.id
        }
        creep.putTo(target)
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
