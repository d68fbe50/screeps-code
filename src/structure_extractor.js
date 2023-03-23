StructureExtractor.prototype.run = function () {
    if (Game.time % 1000 || (!this.room.terminal && !this.room.storage)) return // 间隔设置太小可能存在的情况：miner在孵化队列里未孵化导致再次推送miner孵化任务
    const mineral = this.pos.lookFor(LOOK_MINERALS)[0]
    if (mineral && mineral.ticksToRegeneration) return
    if (this.room.find(FIND_MY_CREEPS, { filter: i => i.memory.role === 'mineHarvester' }).length > 0) return
    const flag = this.pos.lookFor(LOOK_FLAGS)[0]
    if (!flag) return
    this.room.addMineHarvester(flag.name)
}

StructureExtractor.prototype.onBuildComplete = function () {
    this.room.find(FIND_MINERALS).forEach(i => !i.pos.lookFor(LOOK_FLAGS)[0] && i.pos.createFlag(undefined, COLOR_YELLOW, COLOR_CYAN))
}
