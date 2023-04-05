const balanceAmount = 3000
const storageStoreLimit = 900000
const terminalStoreLimit = 250000

StructureTerminal.prototype.run = function () {
    if (Game.time % 10 || this.cooldown > 0 || !this.room.memory.enableTerminal) return

    const storage = this.room.storage
    if (!storage || this.room.getTask('TaskCenter', 'terminal')) return

    if (storage.usedCapacity < storageStoreLimit && this.energy > 20000)
        return this.room.addCenterTask('terminal', 'terminal', 'storage', energy, this.energy - 20000)
    else if (this.usedCapacity < terminalStoreLimit && this.energy < 10000 && storage.energy > 100000)
        return this.room.addCenterTask('terminal', 'storage', 'terminal', energy, 20000 - this.energy)

    const t2sType = _.keys(this.store).find(i => i !== energy && this.store[i] > balanceAmount && storage.usedCapacity < storageStoreLimit)
    if (t2sType) return this.room.addCenterTask('terminal', 'terminal', 'storage', t2sType, this.store[t2sType] - balanceAmount)

    const s2tType = _.keys(storage.store).find(i => i !== energy && storage.store[i] > 0 && this.store[i] < balanceAmount)
    if (s2tType) return this.room.addCenterTask('terminal', 'storage', 'terminal', s2tType, Math.min(balanceAmount - this.store[s2tType], storage.store[s2tType]))

    if (!(this.room.name in Memory.shareTask)) {
        const resourceType = [...mineralTypes, ...t3Types].find(i => this.store[i] < balanceAmount)
        if (resourceType) return Memory.shareTask[this.room.name] = { roomName: this.room.name, resourceType, amount: balanceAmount - this.store[resourceType] }
    }

    if (_.keys(Memory.shareTask).length > 0) {
        const task = _.find(Memory.shareTask, i => i.roomName !== this.room.name && storage.store[i.resourceType] >= balanceAmount && this.store[i.resourceType] >= i.amount)
        const result = task && this.send(task.resourceType, task.amount, task.roomName)
        if (result === OK) return delete Memory.shareTask[task.roomName]
    }
}
