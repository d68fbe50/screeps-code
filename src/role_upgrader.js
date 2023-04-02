const boostPrepare = (creep) => {
    if (creep.room.level === 8) return true
    if (creep.room.memory.roomStatus !== 'Upgrade') return true
    const lab = creep.room.boostLabs.find(i => i.boostType === 'XGH2O')
    if (!lab) return true
    if (creep.pos.isNearTo(lab)) {
        lab.boostCreep(creep)
        return true
    }
    creep.goto(lab)
}

const prepare = (creep) => {
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
    if (creep.pos.isNearTo(energySource) && creep.pos.getRangeTo(creep.room.controller) <= 3) {
        creep.memory.dontPullMe = true
        return true
    }
    const freePos = energySource.pos.availableNeighbors().find(i => i.getRangeTo(creep.room.controller) <= 3)
    if (!freePos) return false
    creep.goto(freePos)
}

const target = (creep) => {
    if (creep.ticksToLive < 100 && creep.boostCounts['XGH2O']) {
        const result = creep.unboost()
        if (result === true) return creep.suicide()
        else if (result === ERR_NOT_IN_RANGE) return
    }
    if (creep.energy <= creep.bodyCounts[WORK]) creep.getFrom(Game.getObjectById(creep.memory.energySourceId))
    creep.upgrade()
}

const bodys = [
    [ [WORK], 2, [CARRY], 1, [MOVE], 1 ],
    [ [WORK], 4, [CARRY], 1, [MOVE], 1 ],
    [ [WORK], 4, [CARRY], 1, [MOVE], 1 ],
    [ [WORK], 8, [CARRY], 1, [MOVE], 2 ],
    [ [WORK], 12, [CARRY], 1, [MOVE], 3 ],
    [ [WORK], 16, [CARRY], 1, [MOVE], 4 ],
    [ [WORK], 36, [CARRY], 2, [MOVE], 9 ],
    [ [WORK], 15, [CARRY], 1, [MOVE], 4 ]
]

module.exports = { boostPrepare, prepare, target, bodys }
