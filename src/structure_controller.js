StructureController.prototype.run = function () {
    this.room.container.forEach(i => i.run && i.run())
    this.room.creepDynamicAdjust()
    onLevelChange(this.room, this.level)

    if (this.room.energyAvailable < this.room.energyCapacityAvailable) this.room.addTransportTask('fillExtension')
    if (Game.time % 10) return
    if (this.room.constructionSites.length > 0) this.room.addWorkTask('build')
    if ([...this.room.wall, ...this.room.rampart].find(i => i.hits < i.hitsMax / 30)) this.room.addWorkTask('repair')
}

function onLevelChange(room, level) {
    if (room.memory.rcl === level) return
    room.memory.rcl = level
    room.updateLayout()
    if (level === 1) {
        room.log('占领成功！请手动操作：[双黄]旗子设置source、[centerPos-?]旗子设置中心点、[isAutoLayout]开启自动布局、[setCreepAmount]发布worker、[useRuinEnergy]使用遗迹能量')
        room.addWorkTask('upgrade')
    } else if (level === 8) {
        room.memory.roomStatus === 'Upgrade' && room.onNormal()
        room.removeTask('TaskWork', 'upgrade')
    }
}
