StructureLink.prototype.run = function () {
    if (this.cooldown > 0) return

    if (this.id === this.room.memory.centerLinkId) {
        if (this.energy < 600) return
        if (supportUpgradeLink(this)) return
        this.room.addCenterTask('centerLink', 'centerLink', 'storage', RESOURCE_ENERGY, this.energy)
    }

    else if (this.id === this.room.memory.upgradeLinkId) {
        if (this.energy > 100) return
        if (!this.room.centerLink || this.room.centerLink.cooldown > 0) return
        const amount = Math.min(this.store.getFreeCapacity(RESOURCE_ENERGY), this.room.centerLink.store.getFreeCapacity(RESOURCE_ENERGY))
        this.room.addCenterTask('centerLink', 'storage', 'centerLink', RESOURCE_ENERGY, amount)
    }

    else {
        if (this.energy < 700) return
        if (supportUpgradeLink(this)) return
        if (this.room.centerLink && this.room.centerLink.energy < 799) this.transferEnergy(this.room.centerLink)
    }
}

StructureLink.prototype.onBuildComplete = function () {
    if (this.room.centerPos && this.pos.isNearTo(this.room.centerPos)) {
        this.room.addCenterTransporter()
        this.room.memory.centerLinkId = this.id
    }
    else if (this.pos.findStructureInRange(STRUCTURE_CONTROLLER, 4)) this.room.memory.upgradeLinkId = this.id
}

function supportUpgradeLink(link) {
    if (link.room.upgradeLink && link.room.upgradeLink.energy <= 100) {
        link.transferEnergy(link.room.upgradeLink)
        return true
    }
    return false
}
