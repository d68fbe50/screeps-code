const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) return true
        creep.buildStructure()
    }
}

const repair = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) return true
        creep.repairWall()
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
