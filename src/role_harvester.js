const isNeed = (creepMemory) => !!Game.flags[creepMemory.config.flagName]

const prepare = function (creep) {
    if (!creep.gotoFlag(creep.memory.config.flagName)) return false

    const source = Game.flags[creep.memory.config.flagName].pos.source
    if (!source) {
        creep.say('no source!')
        creep.memory.dontNeed = true
        return false
    }

    const link = source.pos.findStructureInRange(STRUCTURE_LINK, 2)
    if (link) creep.memory.linkId = link.id
    else {
        const container = source.pos.findStructureInRange(STRUCTURE_CONTAINER, 1)
        if (container) {
            creep.memory.containerId = container.id
            container.onBuildComplete()
        }
    }

    creep.memory.sourceId = source.id
    creep.memory.dontPullMe = true
    return true
}

const target = function (creep) {
    if (creep.ticksToLive < 2) creep.drop(RESOURCE_ENERGY)

    const source = Game.getObjectById(creep.memory.sourceId)
    if (creep.memory.linkId) {
        const link = Game.getObjectById(creep.memory.linkId)
        if (!link) return delete creep.memory.linkId
        if (link.isFull) return
        if (creep.store.getFreeCapacity() <= 2 * 12) creep.putTo(link)
        creep.getFrom(source)
        return
    }
    if (creep.memory.containerId) {
        /** @type StructureContainer */
        const container = Game.getObjectById(creep.memory.containerId)
        if (!container) return delete creep.memory.containerId
        if (!(Game.time % 100)) container.onBuildComplete()
        if (!creep.pos.isEqualTo(container)) return creep.goto(container)
        if (container.hits < container.hitsMax / 2 && creep.energy >= 6) return creep.repairTo(container)
        if (!container.isFull) creep.getFrom(source)
        return
    }
    if (creep.memory.constructionSiteId) {
        const constructionSite = Game.getObjectById(creep.memory.constructionSiteId)
        if (!constructionSite) {
            const container = source.pos.findStructureInRange(STRUCTURE_CONTAINER, 1)
            if (container) {
                creep.memory.containerId = container.id
                container.onBuildComplete()
            }
            return delete creep.memory.constructionSiteId
        }
        if (creep.energy >= 5 * 6) return creep.buildTo(constructionSite)
        creep.getFrom(source)
        return
    }
    const constructionSite = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)[0]
    if (constructionSite) creep.memory.constructionSiteId = constructionSite.id
    else creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
}

const bodys = [
    [ [MOVE, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK], 2, [CARRY], 1 ],
    [ [MOVE, WORK, WORK], 3, [CARRY], 1 ],
    [ [MOVE, WORK, WORK], 3, [CARRY], 1 ],
    [ [MOVE, WORK, WORK], 3, [CARRY], 1 ],
    [ [MOVE, WORK, WORK], 3, [CARRY], 2 ],
    [ [MOVE, WORK, WORK], 3, [CARRY], 2 ],
    [ [MOVE, WORK, WORK], 6, [CARRY], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
