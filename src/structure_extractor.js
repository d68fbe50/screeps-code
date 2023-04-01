StructureExtractor.prototype.run = function () {
    if (Game.time % 100 || (!this.room.terminal && !this.room.storage)) return
    if (this.room.mineral.ticksToRegeneration) return
    if (this.room.creeps.find(i => i.memory.role === 'mineHarvester')) return
    if (this.room.memory['TaskSpawn'].find(i => i.data && i.data.role === 'mineHarvester')) return
    const flag = this.pos.flags[0]
    if (flag) this.room.addMineHarvester(flag.name)
}

StructureExtractor.prototype.onBuildComplete = function () {
    // if (!this.pos.flags[0]) this.pos.createFlag(undefined, COLOR_YELLOW, COLOR_BLUE)
}
