const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) return true
        const result = creep.buildStructure()
        if (!result) creep.room.removeWorkTask(creep.memory.taskKey)
    }
}

const repair = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) return true
        const result = creep.repairWall()
        if (!result) creep.room.removeWorkTask(creep.memory.taskKey)
    }
}

const upgrade = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) return true
        creep.upgrade()
    }
}

module.exports = { build, repair, upgrade }
