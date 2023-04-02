const TASK_TYPE = 'TaskTransport'

const transportTaskConfigs = {
    fillExtension: { priority: 9, minUnits: 1, maxUnits: 2 },
    fillTower: { priority: 7, minUnits: 1, maxUnits: 2 },
    labEnergy: { priority: 5, minUnits: 1, maxUnits: 1 },
    labBoostIn: { priority: 5, minUnits: 1, maxUnits: 1 },
    labBoostOut: { priority: 0, minUnits: 1, maxUnits: 1 },
    labContainerOut: { priority: 0, minUnits: 1, maxUnits: 1 },
    labReactionIn: { priority: 0, minUnits: 1, maxUnits: 1 },
    labReactionOut: { priority: 0, minUnits: 1, maxUnits: 1 },
    nukerEnergy: { priority: -1, minUnits: 1, maxUnits: 1 },
    nukerG: { priority: -1, minUnits: 1, maxUnits: 1 },
    powerSpawnEnergy: { priority: 0, minUnits: 1, maxUnits: 1 },
    powerSpawnPower: { priority: 0, minUnits: 1, maxUnits: 1 },
    sourceContainerOut: { priority: 0, minUnits: 1, maxUnits: 1 },
    upgradeContainerIn: { priority: 0, minUnits: 1, maxUnits: 1 }
}

Room.prototype.getTransportTask = function (key) {
    return this.getTask(TASK_TYPE, key)
}

Room.prototype.addTransportTask = function (key) {
    if (!(key in transportTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = transportTaskConfigs[key]
    return this.addTask(TASK_TYPE, key, {}, priority, 0, minUnits, 0, maxUnits)
}

const fillExtension = {
    source: (creep) => creep.getEnergy(true, false, 0.5),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (creep.fillExtensions()) return undefined
        return false
    }
}

const fillTower = {
    source: (creep) => creep.getEnergy(true, false, 0.5),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (creep.fillTowers()) return undefined
        return false
    }
}

const labEnergy = {
    source: (creep) => creep.getEnergy(true, false, 0.5),
    target: (creep) => {
        if (creep.isEmpty) return true
        if (creep.fillLabEnergy()) return undefined
        return false
    }
}

const labBoostIn = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        let lab = Game.getObjectById(creep.memory.task.boostInLabId)
        if (!lab) {
            lab = creep.room.boostLabs.find(i => i.isEmpty || (i.mineralType === i.boostType && i.store[i.mineralType] < LAB_MINERAL_CAPACITY / 2))
            if (lab) creep.memory.task.boostInLabId = lab.id
            else return undefined
        }
        const result = creep.getFrom(creep.room.getResources(lab.boostType), lab.boostType)
        if (result === OK) return true
        else if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    },
    target: (creep) => {
        const lab = Game.getObjectById(creep.memory.task.boostInLabId)
        if (!lab) return true
        const result = creep.putTo(lab, lab.boostType)
        if (result === OK) return true
        else if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    }
}

const labBoostOut = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        if (creep.isFull) return true
        let lab = Game.getObjectById(creep.memory.task.boostOutLabId)
        if (!lab) {
            lab = creep.room.boostLabs.find(i => !i.isEmpty && i.mineralType !== i.boostType)
            if (lab) creep.memory.task.boostOutLabId = lab.id
            else if (creep.isEmpty) return undefined
            else return true
        }
        const result = creep.getFrom(lab, lab.mineralType)
        if (result !== ERR_NOT_IN_RANGE) delete creep.memory.task.boostOutLabId
        return false
    },
    target: (creep) => creep.clearCarry()
}

const labContainerOut = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        if (creep.isFull) return true
        if (!creep.room.labContainer) return undefined
        let target = Game.getObjectById(creep.memory.task.dropsId)
        if (!target) {
            target = creep.room.labContainer.pos.drops[0]
            if (target) creep.memory.task.dropsId = target.id
            else if (!creep.room.labContainer.isEmpty) target = creep.room.labContainer
            else if (creep.isEmpty) return undefined
            else return true
        }
        const result = creep.getFrom(target, target.resourceType || Object.keys(target.store).find(i => target.store[i] > 0))
        if (result !== ERR_NOT_IN_RANGE) delete creep.memory.task.dropsId
        return false
    },
    target: (creep) => creep.clearCarry()
}

const labReactionIn = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        const sourceType = creep.room.memory.labs.source1 || creep.room.memory.labs.source2
        if (!sourceType) return undefined
        const result = creep.getFrom(creep.room.getResources(sourceType), sourceType)
        if (result === OK) return true
        else if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    },
    target: (creep) => {
        const sourceType = creep.room.memory.labs.source1 || creep.room.memory.labs.source2
        const lab = creep.room.memory.labs.source1 ? creep.room.inLab1 : creep.room.inLab2
        if (!sourceType || !lab) return undefined
        const result = creep.putTo(lab, sourceType)
        if (result === OK) {
            creep.room.memory.labs.source1 ? delete creep.room.memory.labs.source1 : delete creep.room.memory.labs.source2
            return true
        }
        else if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    }
}

const labReactionOut = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        if (creep.isFull) return true
        let lab = Game.getObjectById(creep.memory.task.reactionOutLabId)
        if (!lab) {
            lab = [creep.room.inLab1, creep.room.inLab2, ...creep.room.reactionLabs].find(i => !i.isEmpty)
            if (lab) creep.memory.task.reactionOutLabId = lab.id
            else if (creep.isEmpty) return undefined
            else return true
        }
        const result = creep.getFrom(lab, lab.mineralType)
        if (result !== ERR_NOT_IN_RANGE) delete creep.memory.task.reactionOutLabId
        return false
    },
    target: (creep) => creep.clearCarry()
}

const nukerEnergy = {}

const nukerG = {}

const powerSpawnEnergy = {}

const powerSpawnPower = {}

const sourceContainerOut = {
    prepare: (creep) => creep.clearCarry(),
    source: (creep) => {
        let container = Game.getObjectById(creep.memory.task.sourceContainerId)
        if (!container) {
            container = creep.room.sourceContainers.filter(i => i.energy >= creep.store.getCapacity() / 2).sort((a, b) => b.energy - a.energy)[0]
            if (container) creep.memory.task.sourceContainerId = container.id
            else return undefined
        }
        const result = creep.getFrom(container)
        if (result === OK) return true
        else if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    },
    target: (creep) => {
        const result = creep.putTo(creep.room.storage || creep.room.terminal)
        if (result !== ERR_NOT_IN_RANGE) return undefined
        return false
    }
}

const upgradeContainerIn = {}

module.exports = {
    fillExtension,
    fillTower,
    labEnergy,
    labBoostIn,
    labBoostOut,
    labContainerOut,
    labReactionIn,
    labReactionOut,
    nukerEnergy,
    nukerG,
    powerSpawnEnergy,
    powerSpawnPower,
    sourceContainerOut,
    upgradeContainerIn
}

Creep.prototype.fillExtensions = function () {
    if (this.room.energyAvailable === this.room.energyCapacityAvailable) return true
    let target = Game.getObjectById(this.memory.task.needFillExtensionId)
    if (!target) {
        target = this.pos.findClosestByRange([...this.room.spawn, ...this.room.extension], { filter: i => !i.isFull })
        if (target) this.memory.task.needFillExtensionId = target.id
        else return true
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillExtensionId
    return false
}

Creep.prototype.fillTowers = function () {
    let target = Game.getObjectById(this.memory.task.needFillTowerId)
    if (!target) {
        target = this.pos.findClosestByRange(this.room.tower, { filter: i => i.energy < TOWER_CAPACITY / 2 })
        if (target) this.memory.task.needFillTowerId = target.id
        else return true
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillTowerId
    return false
}

Creep.prototype.fillLabEnergy = function () {
    let target = Game.getObjectById(this.memory.task.needFillLabId)
    if (!target) {
        target = this.pos.findClosestByRange(this.room.lab, { filter: i => i.energy < i.store.getCapacity(RESOURCE_ENERGY) / 2 })
        if (target) this.memory.task.needFillLabId = target.id
        else return true
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.task.needFillLabId
    return false
}
