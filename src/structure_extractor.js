StructureExtractor.prototype.run = function () {
    if (Game.time % 100 || (!this.room.terminal && !this.room.storage)) return
    if (this.room.mineral.ticksToRegeneration) return
    if (_.find(Memory.creeps, { role: 'mineHarvester', home: this.room.name })) return
    if (_.find(this.room.memory['TaskSpawn'], { data: { role: 'mineHarvester' } })) return
    if (this.pos.flags.length > 0) this.room.addMineHarvester()
}
