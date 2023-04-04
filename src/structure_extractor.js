StructureExtractor.prototype.run = function () {
    if (Game.time % 100 || this.room.mineral.ticksToRegeneration || this.pos.flags.length === 0) return
    const mineralInStorage = this.room.storage ? this.room.storage.store[this.room.mineral.mineralType] : 0
    const mineralInTerminal = this.room.terminal ? this.room.terminal.store[this.room.mineral.mineralType] : 0
    if (mineralInStorage + mineralInTerminal > 100000) return
    if (_.find(Memory.creeps, { role: 'mineHarvester', home: this.room.name })) return
    if (_.find(this.room.memory['TaskSpawn'], { data: { role: 'mineHarvester' } })) return
    this.room.addMineHarvester()
}
