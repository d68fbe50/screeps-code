const prepare = function (creep) {
    const flag = Game.flags[creep.memory.config.flagName]
    if (!flag) {
        creep.log('no flag!', 'error')
        return false
    }
    if (!creep.pos.isNearTo(flag)) {
        creep.moveTo(flag)
        return false
    }
    const sources = flag.pos.lookFor(LOOK_SOURCES)
    if (!sources[0]) {
        creep.log('no source!', 'error')
        return false
    }
    creep.memory.sourceId = sources[0].id
    creep.memory.dontPullMe = true
    return true
}

const target = function (creep) {
    const source = Game.getObjectById(creep.memory.sourceId)
    creep.harvest(source)
}

const bodys = [
    { work: 2, carry: 1, move: 1 },
    { work: 4, carry: 1, move: 2 },
    { work: 6, carry: 1, move: 3 },
    { work: 6, carry: 1, move: 3 },
    { work: 6, carry: 1, move: 3 },
    { work: 6, carry: 1, move: 3 },
    { work: 6, carry: 1, move: 3 },
    { work: 6, carry: 1, move: 3 }
]

module.exports = { prepare, target, bodys }
