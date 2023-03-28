StructureLink.prototype.run = function () {
    if (this.cooldown > 0) return

    if (this.id === this.room.memory.centerLinkId) return runCenterLink(this)
    if (this.id === this.room.memory.upgradeLinkId) return runUpgradeLink(this)
    runSourceLink(this)
}

StructureLink.prototype.onBuildComplete = function () {
    const structuresInRange = this.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: i => i.structureType === STRUCTURE_STORAGE || i.structureType === STRUCTURE_TERMINAL || i.structureType === STRUCTURE_FACTORY
    })
    if (structuresInRange[0]) {
        this.room.addCenterTransporter(this.room.memory.centerPos.x, this.room.memory.centerPos.y)
        this.room.memory.centerLinkId = this.id
        this.log('已注册为 centerLink', 'success')
        return
    }

    const sourcesInRange = this.pos.findInRange(FIND_SOURCES, 2)
    if (sourcesInRange[0]) {
        this.log('已注册为 sourceLink', 'success')
        return
    }

    const controllersInRange = this.pos.findInRange(FIND_STRUCTURES, 4, {
        filter: i => i.structureType === STRUCTURE_CONTROLLER
    })
    if (controllersInRange[0]) {
        this.room.memory.upgradeLinkId = this.id
        this.room.setCreepAmount('upgrader', 3)
        this.room.setCreepAmount('worker', 1)
        this.log('已注册为 upgradeLink', 'success')
    }
}

function supportUpgradeLink(link) {
    if (link.room.upgradeLink && link.room.upgradeLink.energy <= 100) {
        link.transferEnergy(link.room.upgradeLink)
        return true
    }
    return false
}

function runCenterLink(link) {
    if (link.energy < 600) return
    if (supportUpgradeLink(link)) return
    link.room.addCenterTask('centerLink', 'centerLink', 'storage', RESOURCE_ENERGY, link.energy)
}

function runUpgradeLink(link) {
    if (link.energy > 100) return
    if (!link.room.centerLink || link.room.centerLink.cooldown > 0) return
    const amount = Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), link.room.centerLink.store.getFreeCapacity(RESOURCE_ENERGY))
    link.room.addCenterTask('centerLink', 'storage', 'centerLink', RESOURCE_ENERGY, amount)
}

function runSourceLink(link) {
    if (link.energy < 700) return
    if (supportUpgradeLink(link)) return
    if (link.room.centerLink && link.room.centerLink.energy < 799) link.transferEnergy(link.room.centerLink)
}
