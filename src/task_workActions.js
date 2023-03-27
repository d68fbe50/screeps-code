const TASK_TYPE = 'TaskWork'

const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.buildStructure()
        if (result) creep.memory.dontPullMe = true
        else creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
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
        if (result) creep.memory.dontPullMe = true
        else creep.room.removeTask(TASK_TYPE, creep.memory.task.key)
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
    }
}

module.exports = { build, repair, upgrade }
