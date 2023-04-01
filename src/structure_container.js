StructureContainer.prototype.run = function () {
    if ((this.room.memory.sourceContainerIds).includes(this.id)) runSourceContainer(this)
    else if (this.room.memory.upgradeContainerId === this.id) runUpgradeContainer(this)
}

StructureContainer.prototype.onBuildComplete = function () {
    if (!this.room.my) return false
    if (this.pos.findInRange(FIND_SOURCES, 1).length > 0) {
        if (this.room.memory.sourceContainerIds.includes(this.id)) return
        this.room.memory.sourceContainerIds = _.uniq([...this.room.memory.sourceContainerIds, this.id])
        this.room.setCreepAmount('transporter', 2)
        this.log('已注册为 sourceContainer')
        return
    }
    if (this.pos.findStructureInRange(STRUCTURE_CONTROLLER, 4)) {
        this.room.memory.upgradeContainerId = this.id
        this.log('已注册为 upgradeContainer')
    }
}

function runSourceContainer(container) {
    if (container.energy > container.capacity / 2 && (container.room.storage || container.room.terminal)) container.room.addTransportTask('sourceContainerOut')
}

function runUpgradeContainer(container) {
    //
}

Object.defineProperty(Room.prototype, 'sourceContainers', {
    get() {
        return this.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => !!i)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'upgradeContainer', {
    get() {
        return Game.getObjectById(this.memory.upgradeContainerId)
    },
    configurable: true
})
