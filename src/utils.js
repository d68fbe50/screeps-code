function calcBodyPart(bodySet) {
    const bodys = Object.keys(bodySet).map(type => Array(bodySet[type]).fill(type))
    return [].concat(...bodys)
}

function getBodyConfig(...bodySets) {
    const config = { 300: [], 550: [], 800: [], 1300: [], 1800: [], 2300: [], 5600: [], 10000: [] }
    Object.keys(config).map((level, index) => {
        config[level] = calcBodyPart(bodySets[index])
    })
    return config
}

function createBodyGetter(bodyConfig) {
    return function(room, spawn) {
        const targetLevel = Object.keys(bodyConfig)
            .reverse()
            .find(level => {
                const availableEnergyCheck = Number(level) <= room.energyAvailable
                const dryCheck = spawn.spawnCreep(bodyConfig[level], 'bodyTester', { dryRun: true }) === OK
                return availableEnergyCheck && dryCheck
            })
        if (!targetLevel) return []
        return bodyConfig[targetLevel]
    }
}

module.exports = { getBodyConfig, createBodyGetter }
