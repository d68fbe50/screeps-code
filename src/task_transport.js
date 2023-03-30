const TASK_TYPE = 'TaskTransport'

const transportTaskConfigs = {
    fillExtension: { priority: 9, minUnits: 1, maxUnits: 2 },
    fillTower: { priority: 7, minUnits: 1, maxUnits: 2 },
    labEnergy: { priority: 5, minUnits: 1, maxUnits: 1 },
    labBoostIn: { priority: 5, minUnits: 1, maxUnits: 1 },
    labBoostOut: { priority: 5, minUnits: 1, maxUnits: 1 },
    labReactionIn: { priority: 5, minUnits: 1, maxUnits: 1 },
    labReactionOut: { priority: 5, minUnits: 1, maxUnits: 1 },
    nukerEnergy: { priority: 0, minUnits: 1, maxUnits: 1 },
    nukerG: { priority: 0, minUnits: 1, maxUnits: 1 },
    pickupDropped: { priority: 0, minUnits: 1, maxUnits: 1 },
    powerSpawnEnergy: { priority: 1, minUnits: 1, maxUnits: 1 },
    powerSpawnPower: { priority: 1, minUnits: 1, maxUnits: 1 },
    sourceContainerOut: { priority: 0, minUnits: 1, maxUnits: 2 },
    upgradeContainerIn: { priority: 0, minUnits: 1, maxUnits: 1 }
}

Room.prototype.addTransportTask = function (key) {
    if (!(key in transportTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = transportTaskConfigs[key]
    return this.addTask(TASK_TYPE, key, {}, priority, 0, minUnits, 0, maxUnits)
}

const fillExtension = {
    source: (creep) => creep.getEnergy(true, false, 0.1),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.fillExtensions()) return undefined
        return false
    }
}

const fillTower = {
    source: (creep) => creep.getEnergy(true, false, 0.1),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.fillTowers()) return undefined
        return false
    }
}

const labEnergy = {}

const labBoostIn = {}

const labBoostOut = {}

const labReactionIn = {}

const labReactionOut = {}

const nukerEnergy = {}

const nukerG = {}

const pickupDropped = {}

const powerSpawnEnergy = {}

const powerSpawnPower = {}

const sourceContainerOut = {
    source: (creep) => {
        if (!creep.isEmpty) {
            creep.clearResources()
            return false
        }
        let container = Game.getObjectById(creep.memory.task.sourceContainerId)
        if (!container) {
            container = creep.room.sourceContainers.filter(i => i.energy >= creep.capacity / 2).sort((a, b) => b.energy - a.energy)[0]
            if (container) creep.memory.task.sourceContainerId = container.id
        }
        const result = creep.getFrom(container)
        if (result === OK) {
            delete creep.memory.task.sourceContainerId
            return true
        } else if (result !== ERR_NOT_IN_RANGE) {
            delete creep.memory.task.sourceContainerId
            return undefined
        }
        return false
    },
    target: (creep) => {
        const result = creep.putTo(creep.room.storage || creep.room.terminal)
        return result === OK
    }
}

const upgradeContainerIn = {
    source: (creep) => creep.getEnergy(false, false, 0.5),
    target: (creep) => {
        if (creep.isEmpty) return true
        const container = Game.getObjectById(creep.room.memory.upgradeContainerId)
        if (!container) return undefined
        const result = creep.putTo(container)
        if (result === OK) return undefined
        return false
    }
}

module.exports = {
    fillExtension,
    fillTower,
    labEnergy,
    labBoostIn,
    labBoostOut,
    labReactionIn,
    labReactionOut,
    nukerEnergy,
    nukerG,
    pickupDropped,
    powerSpawnEnergy,
    powerSpawnPower,
    sourceContainerOut,
    upgradeContainerIn
}
