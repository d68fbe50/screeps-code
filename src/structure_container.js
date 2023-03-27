StructureContainer.prototype.run = function () {
    if ((this.room.memory.sourceContainerIds).includes(this.id)) runSourceContainer(this)
    else if (this.room.memory.upgradeContainerId === this.id) runUpgradeContainer(this)
}

StructureContainer.prototype.onBuildComplete = function () {
    if (!this.room.my) return false
    if (this.pos.findInRange(FIND_SOURCES, 1).length > 0) {
        if (this.room.memory.sourceContainerIds.includes(this.id)) return
        this.room.memory.sourceContainerIds = _.uniq([...this.room.memory.sourceContainerIds, this.id])
        this.room.addCreep('transporter', 1)
        this.log('已注册为 sourceContainer', 'success')
        return
    }
    if (this.pos.findInRange(FIND_STRUCTURES, 4, { filter: { structureType: STRUCTURE_CONTROLLER } }).length > 0) {
        this.room.memory.upgradeContainerId = this.id
        this.log('已注册为 upgradeContainer', 'success')
    }
}

function runSourceContainer(container) {
    if (container.energy > 1000 && (container.room.storage || container.room.terminal)) container.room.addTransportTask('sourceContainerOut')
}

function runUpgradeContainer(container) {
    //
}