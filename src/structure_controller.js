const buildCheckInterval = 10
const wallCheckInterval = 10

StructureController.prototype.run = function () {
    checkRoomMemory(this.room)
    this.room.container.forEach(i => i.run && i.run())
    if (!(Game.time % buildCheckInterval)) this.room.constructionSites.length > 0 && this.room.addWorkTask('build')
    if (!(Game.time % wallCheckInterval)) [...this.room.wall, ...this.room.rampart].find(i => i.hits < wallRepairHitsMax * 0.8) && this.room.addWorkTask('repair')
    onLevelChange(this.room, this.level)
    visualTaskDetails(this.room)
    collectRoomStats(this.room, this)
}

function checkRoomMemory(room) {
    if (!room.memory.centerPos) room.memory.centerPos = {}
    if (!room.memory.sourceContainerIds) room.memory.sourceContainerIds = []
    if (!room.memory.TaskCenter) room.memory.TaskCenter = []
    if (!room.memory.TaskSpawn) room.memory.TaskSpawn = []
    if (!room.memory.TaskTransport) room.memory.TaskTransport = []
    if (!room.memory.TaskWork) room.memory.TaskWork = []
    if (!room.memory.remoteLocks) room.memory.remoteLocks = {}
}

function onLevelChange(room, level) {
    if (room.memory.rcl === level) return
    room.memory.rcl = level
    room.updateLayout()
    if (level === 1) {
        room.log('占领成功！请手动操作：双黄旗子设置source、紫红旗子设置中心点、setCreepAmount发布worker、isAutoLayout开启自动布局、useRuinEnergy使用遗迹能量')
        room.addWorkTask('upgrade')
    } else if (level === 8) {
        room.setCreepAmount('upgrader', 1)
        room.removeTask('TaskWork', 'upgrade')
    }
}

function visualTaskDetails(room) {
    let visualTextY = 25
    room.visual.text(`Transporter: ${room.memory.transporterAmount}, Worker: ${room.memory.workerAmount}, Upgrader: ${room.memory.upgraderAmount}`, 1, visualTextY++, { align: 'left' })
    let text = 'TaskCenter : ' + room.memory['TaskCenter'].map(i => `[${i.data.source}->${i.data.target}: ${i.data.resourceType}*${i.data.amount}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskSpawn : ' + room.memory['TaskSpawn'].map(i => `[${i.data.role}: ${i.key}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskTransport : ' + room.memory['TaskTransport'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskWork : ' + room.memory['TaskWork'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
}

function collectRoomStats(room, controller) {
    if (Game.time % 10) return
    // if (!Memory.stats.rooms[room.name]) Memory.stats.rooms[room.name] = {}
    // Memory.stats.rooms[room.name].rcl = controller.level
    // Memory.stats.rooms[room.name].rclPercent = (controller.progress / (controller.progressTotal || 1)) * 100
    // Memory.stats.rooms[room.name].energy = room[RESOURCE_ENERGY]
    Memory.stats[room.name + '-rcl'] = controller.level
    Memory.stats[room.name + '-rclPercent'] = (controller.progress / (controller.progressTotal || 1)) * 100
    Memory.stats[room.name + '-energy'] = room[RESOURCE_ENERGY]
}
