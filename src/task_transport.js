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
    sourceContainerOut: { priority: 0, minUnits: 1, maxUnits: 1 },
    upgradeContainerIn: { priority: 0, minUnits: 1, maxUnits: 1 }
}

Room.prototype.addTransportTask = function (key) {
    if (!(key in transportTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = transportTaskConfigs[key]
    return this.addTask(TASK_TYPE, key, {}, priority, 0, minUnits, 0, maxUnits)
}

const fillExtension = {
    source: (creep) => creep.getEnergy(true, false, 1/2),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.fillExtensions()) return undefined
        return false
    }
}

const fillTower = {
    source: (creep) => creep.getEnergy(true, false, 1/2),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.fillTowers()) return undefined
        return false
    }
}

const labEnergy = {
    source: (creep) => creep.getEnergy(true, false, 1/2),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.fillLabEnergy()) return undefined
        return false
    }
}

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

Creep.prototype.fillExtensions = function () {
    if (this.room.energyAvailable === this.room.energyCapacityAvailable) return false
    let target = Game.getObjectById(this.memory.task.needFillExtensionId)
    if (!target) {
        target = this.pos.findClosestByRange([...this.room.spawn, ...this.room.extension], { filter: i => !i.isFull })
        if (target) this.memory.task.needFillExtensionId = target.id
        else return false
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillExtensionId
    return true
}

Creep.prototype.fillTowers = function () {
    let target = Game.getObjectById(this.memory.task.needFillTowerId)
    if (!target) {
        target = this.pos.findClosestByRange(this.room.tower, { filter: i => i.energy < i.capacity / 2 })
        if (target) this.memory.task.needFillTowerId = target.id
        else return false
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillTowerId
    return true
}

Creep.prototype.fillLabEnergy = function () {
    let target = Game.getObjectById(this.memory.task.needFillLabId)
    if (!target) {
        target = this.pos.findClosestByRange(this.room.lab, { filter: i => i.energy < i.store.getCapacity(RESOURCE_ENERGY) / 2 })
        if (target) this.memory.task.needFillLabId = target.id
        else return false
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillLabId
    return true
}
