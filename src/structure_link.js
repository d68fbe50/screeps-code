StructureLink.prototype.run = function() {
    if (this.cooldown > 0) return

    if (this.id === this.room.memory.centerLinkId) return runCenterLink(this)
    if (this.id === this.room.memory.upgradeLinkId) return runUpgradeLink(this)
    runSourceLink(this)
}

StructureLink.prototype.onBuildComplete = function() {
    const structuresInRange = this.pos.findInRange(FIND_MY_STRUCTURES, 2, {
        filter: i => i.structureType === STRUCTURE_STORAGE || i.structureType === STRUCTURE_TERMINAL || i.structureType === STRUCTURE_FACTORY
    })
    if (structuresInRange[0]) {
        // TODO 发布centetTrans-role
        return this.room.memory.centerLinkId = this.id
    }

    const sourcesInRange = this.pos.findInRange(FIND_SOURCES, 2)
    if (sourcesInRange[0]) return

    const controllersInRange = this.pos.findInRange(FIND_MY_STRUCTURES, 4, {
        filter: i => i.structureType === STRUCTURE_CONTROLLER
    })
    if (controllersInRange[0]) return this.room.memory.upgradeLinkId = this.id
}

function supportUpgradeLink(link) {
    if (link.room.upgradeLink && link.room.upgradeLink.store[RESOURCE_ENERGY] <= 100) {
        link.transferEnergy(link.room.upgradeLink)
        return true
    }
    return false
}

function runCenterLink(link) {
    if (link.store[RESOURCE_ENERGY] < 600) return
    if (supportUpgradeLink(link)) return
    link.room.addCenterTask('centerLink', undefined, 'centerLink', 'storage', RESOURCE_ENERGY, link.store[RESOURCE_ENERGY])
}

function runUpgradeLink(link) {
    if (link.store[RESOURCE_ENERGY] > 100) return
    if (!link.room.centerLink || link.room.centerLink.cooldown > 0) return
    const amount = Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), link.room.centerLink.store.getFreeCapacity(RESOURCE_ENERGY))
    link.room.addCenterTask('centerLink', undefined, 'storage', 'centerLink', RESOURCE_ENERGY, amount)
}

function runSourceLink(link) {
    if (link.store.getUsedCapacity(RESOURCE_ENERGY) < 700) return
    if (supportUpgradeLink(link)) return
    if (link.room.centerLink && link.room.centerLink.store[RESOURCE_ENERGY] < 799) link.transferEnergy(link.room.centerLink)
}
