StructureLink.prototype.run = function () {
    if (this.cooldown > 0) return

    if (this.id === this.room.memory.centerLinkId) return runCenterLink(this)
    if (this.id === this.room.memory.upgradeLinkId) return runUpgradeLink(this)
    runSourceLink(this)
}

StructureLink.prototype.onBuildComplete = function () {
    const structuresInRange = this.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: i => i.structureType === STRUCTURE_STORAGE || i.structureType === STRUCTURE_TERMINAL || i.structureType === STRUCTURE_POWER_SPAWN
    })
    if (structuresInRange[0]) {
        this.room.addCenterTransporter(this.room.memory.centerPos.x, this.room.memory.centerPos.y)
        this.room.memory.centerLinkId = this.id
        this.log('已注册为 centerLink')
        return
    }

    if (this.pos.findInRange(FIND_SOURCES, 2).length > 0) {
        this.log('已注册为 sourceLink')
        return
    }

    if (this.pos.findStructureInRange(STRUCTURE_CONTROLLER, 4)) {
        this.room.memory.upgradeLinkId = this.id
        this.log('已注册为 upgradeLink')
    }
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

function supportUpgradeLink(link) {
    if (link.room.upgradeLink && link.room.upgradeLink.energy <= 100) {
        link.transferEnergy(link.room.upgradeLink)
        return true
    }
    return false
}

Object.defineProperty(Room.prototype, 'centerLink', {
    get() {
        return this.memory.centerLinkId && Game.getObjectById(this.memory.centerLinkId)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'upgradeLink', {
    get() {
        return this.memory.upgradeLinkId && Game.getObjectById(this.memory.upgradeLinkId)
    },
    configurable: true
})
