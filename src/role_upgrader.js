const boostPrepare = function (creep) {
    return true
}

const prepare = function (creep) {
    let energySource = Game.getObjectById(creep.memory.energySourceId)
    if (!energySource) {
        if (creep.room.terminal && creep.room.terminal.pos.getRangeTo(creep.room.controller) <= 4) energySource = creep.room.terminal
        else if (creep.room.upgradeLink) energySource = creep.room.upgradeLink
        else if (creep.room.upgradeContainer) energySource = creep.room.upgradeContainer
        if (energySource) creep.memory.energySourceId = energySource.id
        else {
            creep.say('no source!')
            return false
        }
    }
    const freePos = energySource.pos.availableNeighbors().find(i => i.getRangeTo(creep.room.controller) <= 3)
    if (!freePos) {
        creep.say('no pos!')
        return false
    }
    if (creep.pos.isNearTo(energySource) && creep.pos.getRangeTo(creep.room.controller) <= 3) {
        creep.memory.dontPullMe = true
        return true
    }
    creep.goto(freePos)
}

const target = function (creep) {
    if (creep.energy <= 16) creep.getFrom(Game.getObjectById(creep.memory.energySourceId))
    creep.upgrade()
}

const bodys = [
    [ [MOVE, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 2, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 3, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 4, [CARRY], 2 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 4, [CARRY], 2 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 4, [CARRY], 2 ]
]

module.exports = { boostPrepare, prepare, target, bodys }
