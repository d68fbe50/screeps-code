StructureExtractor.prototype.run = function () {
    if (Game.time % 10 || this.room.mineral.ticksToRegeneration || this.pos.flags.length === 0) return
    if (_.find(Memory.creeps, { role: 'mineHarvester', home: this.room.name })) return
    if (_.find(this.room.memory['TaskSpawn'], { data: { role: 'mineHarvester' } })) return
    this.room.addMineHarvester()
}
