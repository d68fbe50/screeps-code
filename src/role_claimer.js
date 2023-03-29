const isNeed = function () {
    return false
}

const prepare = function (creep) {
    return creep.gotoFlagRoom(creep.memory.config.flagName)
}

const target = function (creep) {
    const result = creep.claim()
    if (result === OK) {
        creep.home.addHelper(creep.memory.config.flagName)
        return creep.suicide()
    }
}

const bodys = [
    { move: 1, claim: 1 },
    { move: 1, claim: 1 },
    { move: 3, claim: 1 },
    { move: 5, claim: 1 },
    { move: 5, claim: 1 },
    { move: 5, claim: 1 },
    { move: 5, claim: 1 },
    { move: 5, claim: 1 }
]

module.exports = { isNeed, prepare, target, bodys }
