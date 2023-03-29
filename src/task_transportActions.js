const TASK_TYPE = 'TaskTransport'

const fillExtension = {
    source: (creep) => creep.getEnergy(true, false, 0.1),
    target: (creep) => {
        if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
            creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
            delete creep.memory.task.needFillSpawnExtId
            return true
        }
        if (creep.isEmpty) return true
        let target = Game.getObjectById(creep.memory.task.needFillSpawnExtId)
        if (!target || target.isFull) {
            target = creep.pos.findClosestByRange([...creep.room.spawn, ...creep.room.extension], { filter: i => !i.isFull })
            creep.memory.task.needFillSpawnExtId = target.id // target 一定存在
        }
        creep.putTo(target)
    }
}

const fillTower = {
    source: (creep) => creep.getEnergy(true, false, 0.1),
    target: (creep) => {
        if (creep.isEmpty) return true
        let target = Game.getObjectById(creep.memory.task.needFillTowerId)
        if (!target || target.isFull) {
            target = creep.pos.findClosestByRange(creep.room.tower, { filter: i => i.energy < 800 })
            if (!target) {
                creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
                delete creep.memory.task.needFillTowerId
                return true
            }
            creep.memory.task.needFillTowerId = target.id
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
            creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
            delete creep.memory.task.sourceContainerId
        }
    },
    target: (creep) => {
        const result = creep.putTo(creep.room.storage || creep.room.terminal)
        if (result === OK) return true
    }
}

const upgradeContainerIn = {
    source: (creep) => creep.getEnergy(false, false, 0.5),
    target: (creep) => {
        if (creep.isEmpty) return true
        const container = Game.getObjectById(creep.room.memory.upgradeContainerId)
        if (!container) {
            creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
            return true
        }
        const result = creep.putTo(container)
        if (result === OK) {
            creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
            return true
        }
    }
}

module.exports = { fillExtension, fillTower, labEnergy, labIn, labOut, nukerEnergy, nukerG, powerSpawnEnergy, powerSpawnPower, sourceContainerOut, upgradeContainerIn }
