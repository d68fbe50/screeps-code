const isNeed = function () {
    return false
}

const prepare = function (creep) {
    const flag = Game.flags[creep.memory.config.flagName]
    if (!flag) {
        creep.log('no flag!', 'error')
        return false
    }
    if (creep.room.name !== flag.pos.roomName) {
        creep.goto(flag)
        return false
    }
    return true
}

const target = function (creep) {
    const result = creep.claim()
    if (result === OK) {
        const home = Game.rooms[creep.memory.home]
        home && home.addHelper(creep.room.name)
        Game.flags[creep.memory.config.flagName] && Game.flags[creep.memory.config.flagName].remove()
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
