const TASK_TYPE = 'TaskWork'

const workTaskConfigs = {
    build: { priority: 9, minUnits: 1, maxUnits: 5 },
    repair: { priority: 6, minUnits: 1, maxUnits: 1 },
    upgrade: { priority: 3, minUnits: 0, maxUnits: 10 }
}

Room.prototype.addWorkTask = function (key) {
    if (!(key in workTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = workTaskConfigs[key]
    return this.addTask(TASK_TYPE, key, {}, priority, 0, minUnits, 0, maxUnits)
}

const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.buildStructure()
        if (!result) return undefined
        creep.memory.dontPullMe = true
        return false
    }
}

const repair = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.repairWall()
        if (!result) return undefined
        creep.memory.dontPullMe = true
        return false
    }
}

const upgrade = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.upgrade()
        if (result === OK) creep.memory.dontPullMe = true
        return false
    }
}

module.exports = { build, repair, upgrade }
