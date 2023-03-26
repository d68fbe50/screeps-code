StructureExtractor.prototype.run = function () {
    if (Game.time % 1000 || (!this.room.terminal && !this.room.storage)) return // time间隔设置太小可能存在的情况：miner在孵化队列里未孵化导致再次推送miner孵化任务
    if (this.room.mineral.ticksToRegeneration) return
    if (this.room.creeps.find(i => i.memory.role === 'mineHarvester')) return
    const flag = this.pos.lookFor(LOOK_FLAGS)[0]
    if (flag) this.room.addMineHarvester(flag.name)
}

StructureExtractor.prototype.onBuildComplete = function () {
    if (!this.pos.lookFor(LOOK_FLAGS)[0]) this.pos.createFlag(undefined, COLOR_YELLOW, COLOR_BLUE)
}
