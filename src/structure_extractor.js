StructureExtractor.prototype.run = function () {
    if (Game.time % 100 || this.room.mineral.ticksToRegeneration || this.pos.flags.length === 0 || !this.room.storage || !this.room.terminal) return
    if (this.room.resAmount(this.room.mineral.mineralType) > 100000 || this.room.storage.freeCapacity < 100000) return
    if (_.find(Memory.creeps, { role: 'mineHarvester', home: this.room.name })) return
    if (_.find(this.room.memory['TaskSpawn'], { data: { role: 'mineHarvester' } })) return
    this.room.addMineHarvester()
}
