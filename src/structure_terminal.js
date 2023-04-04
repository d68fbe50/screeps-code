StructureTerminal.prototype.run = function () {
    if (Game.time % 10 || this.cooldown > 0) return

    if (!this.room.storage || this.room.state === state.Upgrade) return

    if (this.freeCapacity < 10000 && this.energy > 10000 && this.room.storage.freeCapacity > 100000)
        this.room.addCenterTask('terminal', 'terminal', 'storage', energy, Math.min(this.energy - 10000, this.room.storage.freeCapacity, 10000))
    else if (this.energy < 10000 && this.freeCapacity > 10000 && this.room.storage.energy > 100000)
        this.room.addCenterTask('terminal', 'storage', 'terminal', energy, 10000 - this.energy)
}
