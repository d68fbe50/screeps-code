StructureContainer.prototype.run = function () {
    if ((this.room.memory.sourceContainerIds).includes(this.id)) {
        if (!this.room.storage && !this.room.terminal) return
        if (this.energy > CONTAINER_CAPACITY / 2) this.room.addTransportTask('sourceContainerOut')
    }

    else if (this.room.memory.upgradeContainerId === this.id) {
        if (this.energy < CONTAINER_CAPACITY / 2) this.room.addTransportTask('upgradeContainerIn')
    }

    else if (this.room.memory.labContainerId === this.id) {
        if (this.store.getUsedCapacity() > CONTAINER_CAPACITY / 2) this.room.addTransportTask('labContainerOut')
    }
}

StructureContainer.prototype.onBuildComplete = function () {
    if (this.pos.findInRange(FIND_SOURCES, 1).length > 0) {
        if (this.room.memory.sourceContainerIds.includes(this.id)) return
        this.room.memory.sourceContainerIds = _.uniq([...this.room.memory.sourceContainerIds, this.id])
        this.room.setCreepAmount('transporter', 2)
    }
    else if (this.pos.findStructureInRange(STRUCTURE_CONTROLLER, 4)) this.room.memory.upgradeContainerId = this.id
    else if (this.pos.findStructureInRange(STRUCTURE_LAB, 1)) this.room.memory.labContainerId = this.id
}
