const isNeed = (creepMemory) => !!Game.flags[creepMemory.config.flagName]

const prepare = (creep) => {
    if (!creep.gotoFlag(creep.memory.config.flagName)) return false
    const source = Game.flags[creep.memory.config.flagName].pos.source
    if (!source) {
        creep.say('no source!')
        creep.memory.dontNeed = true
        return false
    }
    const link = source.pos.findStructureInRange(STRUCTURE_LINK, 2)
    const container = source.pos.findStructureInRange(STRUCTURE_CONTAINER, 1)
    if (link) {
        creep.memory.linkId = link.id
        container && container.destroy()
    } else if (container) {
        creep.memory.containerId = container.id
        container.onBuildComplete()
    }
    creep.memory.sourceId = source.id
    creep.memory.dontPullMe = true
    return true
}

const target = (creep) => {
    const source = Game.getObjectById(creep.memory.sourceId)
    if (creep.memory.linkId) {
        const link = Game.getObjectById(creep.memory.linkId)
        if (!link) return delete creep.memory.linkId
        if (link.isFull) return
        if (creep.freeCapacity <= creep.bodyCounts[WORK] * 2) creep.putTo(link)
        creep.getFrom(source)
        return
    }
    if (creep.memory.containerId) {
        /** @type StructureContainer */
        const container = Game.getObjectById(creep.memory.containerId)
        if (!container) return delete creep.memory.containerId
        if (!(Game.time % 100)) container.onBuildComplete()
        if (!creep.pos.isEqualTo(container)) return creep.goto(container)
        if (container.hits < container.hitsMax / 2 && creep.energy >= creep.bodyCounts[WORK]) return creep.repairTo(container)
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
        if (creep.energy >= creep.bodyCounts[WORK] * 5) return creep.buildTo(constructionSite)
        creep.getFrom(source)
        return
    }
    const constructionSite = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)[0]
    if (constructionSite) creep.memory.constructionSiteId = constructionSite.id
    else creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
}

const bodys = [
    [ [MOVE], 1, [WORK], 2, [CARRY], 1 ],
    [ [MOVE], 2, [WORK], 4, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 2 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 2 ],
    [ [MOVE], 6, [WORK], 12, [CARRY], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
