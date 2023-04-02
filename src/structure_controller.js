StructureController.prototype.run = function () {
    this.room.container.forEach(i => i.run && i.run())
    this.room.creepDynamicAdjust()
    onLevelChange(this.room, this.level)

    if (this.room.energyAvailable < this.room.energyCapacityAvailable) this.room.addTransportTask('fillExtension')
    if (Game.time % 10) return
    [...this.room.wall, ...this.room.rampart].find(i => i.hits < i.hitsMax / 30) && this.room.addWorkTask('repair')
    this.room.constructionSites.length > 0 && this.room.addWorkTask('build')
}

function onLevelChange(room, level) {
    if (room.memory.rcl === level) return
    room.memory.rcl = level
    room.updateLayout()
    if (level === 1) {
        room.log('占领成功！请手动操作：[双黄]旗子设置source、[紫红]旗子设置中心点、[setCreepAmount]发布worker、[isDynamicAdjust]开启爬动态数量、[isAutoLayout]开启自动布局、[useRuinEnergy]使用遗迹能量')
        room.addWorkTask('upgrade')
    } else if (level === 8) {
        room.removeTask('TaskWork', 'upgrade')
    }
}
