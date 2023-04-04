const shareLimit = 5000
const shareResources = ['O', 'H', 'Z', 'K', 'U', 'L', 'X', 'XZH2O', 'XZHO2', 'XKH2O', 'XKHO2', 'XUH2O', 'XUHO2', 'XLH2O', 'XLHO2', 'XGH2O', 'XGHO2']

StructureTerminal.prototype.run = function () {
    if (Game.time % 10 || this.cooldown > 0 || !this.room.memory.enableTerminal) return

    if (Object.keys(Memory.shareTask).length > 0) {
        const task = _.find(Memory.shareTask, i => i.roomName !== this.room.name && this.store[i.resourceType] - shareLimit > i.amount)
        const result = task && this.send(task.resourceType, task.amount, task.roomName)
        if (result === OK) delete Memory.shareTask[task.roomName]
    }

    if (!(this.room.name in Memory.shareTask)) {
        const resourceType = shareResources.find(i => this.store[i] < shareLimit)
        if (resourceType) Memory.shareTask[this.room.name] = { resourceType, amount: shareLimit - this.store[resourceType], roomName: this.room.name }
    }

    // if (this.freeCapacity < 10000 && this.energy > 10000 && this.room.storage.freeCapacity > 100000)
    //     this.room.addCenterTask('terminal', 'terminal', 'storage', energy, Math.min(this.energy - 10000, this.room.storage.freeCapacity, 10000))
    // else if (this.energy < 10000 && this.freeCapacity > 10000 && this.room.storage.energy > 100000)
    //     this.room.addCenterTask('terminal', 'storage', 'terminal', energy, 10000 - this.energy)
}
