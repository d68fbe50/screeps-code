const TASK_TYPE = 'TaskWork'

const WORK_TYPES = {
    build: 9,
    repair: 6,
    upgrade: 3
}

const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.buildStructure()
        if (result) creep.memory.dontPullMe = true
        else creep.room.removeTask(TASK_TYPE, creep.memory.taskKey)
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
        else creep.room.removeTask(TASK_TYPE, creep.memory.taskKey)
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
        if (result) creep.memory.dontPullMe = true
    }
}

module.exports = { WORK_TYPES, build, repair, upgrade }
