StructureContainer.prototype.run = function () {
    if ((this.room.memory.sourceContainerIds).includes(this.id)) runSourceContainer(this)
    else if (this.room.memory.upgradeContainerId === this.id) runUpgradeContainer(this)
    else if (this.room.memory.labContainerId === this.id) runLabContainer(this)
}

StructureContainer.prototype.onBuildComplete = function () {
    if (!this.room.my) return false

    if (this.pos.findInRange(FIND_SOURCES, 1).length > 0) {
        if (this.room.memory.sourceContainerIds.includes(this.id)) return
        this.room.memory.sourceContainerIds = _.uniq([...this.room.memory.sourceContainerIds, this.id])
        this.room.setCreepAmount('transporter', 2)
        this.log('已注册为 sourceContainer')
    }
    else if (this.pos.findStructureInRange(STRUCTURE_CONTROLLER, 4)) {
        this.room.memory.upgradeContainerId = this.id
        this.log('已注册为 upgradeContainer')
    }
    else if (this.pos.findStructureInRange(STRUCTURE_LAB, 1)) {
        this.room.memory.labContainerId = this.id
        this.log('已注册为 labContainer')
    }
}

function runSourceContainer(container) {
    if (!container.room.storage && !container.room.terminal) return
    if (container.energy > container.capacity / 2) container.room.addTransportTask('sourceContainerOut')
}

function runUpgradeContainer(container) {
    if (container.energy < container.capacity / 2) container.room.addTransportTask('upgradeContainerIn')
}

function runLabContainer(container) {
    if (!container.isEmpty) container.room.addTransportTask('labContainerOut')
}
