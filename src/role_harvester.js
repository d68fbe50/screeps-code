const isNeed = function (creepMemory) {
    return !!Game.flags[creepMemory.config.flagName]
}

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
    const source = flag.pos.lookFor(LOOK_SOURCES)[0]
    if (!source) {
        creep.log('no source!', 'error')
        return false
    }
    const link = source.pos.findInRange(FIND_STRUCTURES, 2, { filter: { structureType: STRUCTURE_LINK } })[0]
    if (link) creep.memory.linkId = link.id
    else {
        const container = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } })[0]
        if (container) creep.memory.containerId = container.id
    }
    creep.memory.sourceId = source.id
    creep.memory.dontPullMe = true
    return true
}

const target = function (creep) {
    if (creep.memory.role === 'remoteHarvester' && creep.hits < creep.hitsMax && !creep.memory.dontNeed) {
        creep.memory.dontNeed = true
        // TODO: delayTask
    }

    const source = Game.getObjectById(creep.memory.sourceId)
    if (creep.memory.linkId) {
        const link = Game.getObjectById(creep.memory.linkId)
        if (!link) return delete creep.memory.linkId
        if (link.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return
        if (creep.store.getFreeCapacity() <= 2 * 6) creep.putTo(link)
        creep.getFrom(source)
        return
    }
    if (creep.memory.containerId) {
        const container = Game.getObjectById(creep.memory.containerId)
        if (!container) return delete creep.memory.containerId
        if (!creep.pos.isEqualTo(container)) return creep.moveTo(container)
        if (container.hits / container.hitsMax < 0.5 && creep.store[RESOURCE_ENERGY] >= 6) return creep.repairTo(container)
        if (container.store.getFreeCapacity() > 0) creep.getFrom(source)
        return
    }
    if (creep.memory.constructionSiteId) {
        const constructionSite = Game.getObjectById(creep.memory.constructionSiteId)
        if (!constructionSite) {
            const container = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_CONTAINER } })[0]
            if (container) creep.memory.containerId = container.id
            return delete creep.memory.constructionSiteId
        }
        if (creep.store[RESOURCE_ENERGY] >= 5 * 6) return creep.buildTo(constructionSite)
        creep.getFrom(source)
        return
    }
    const constructionSite = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)[0]
    if (constructionSite) creep.memory.constructionSiteId = constructionSite.id
    else creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
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

module.exports = { isNeed, prepare, target, bodys }
