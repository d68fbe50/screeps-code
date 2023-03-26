StructureController.prototype.run = function () {
    checkRoomMemory(this.room)
    collectRoomStats(this)
    visualTaskDetails(this.room)
    onLevelChange(this)
    if (!(Game.time % 10)) this.room.constructionSites.length > 0 && this.room.addWorkTask('build')
    if (!(Game.time % 10)) this.room.addWorkTask('upgrade')
    if (!(Game.time % 100)) this.room.update()
}

function checkRoomMemory(room) {
    if (!Memory.stats.rooms[room.name]) Memory.stats.rooms[room.name] = {}
    if (!room.memory.centerPos) room.memory.centerPos = {}
    if (!room.memory.sourceContainerList) room.memory.sourceContainerList = []
    if (!(Game.time % 1000)) room.memory.sourceContainerList = room.memory.sourceContainerList.filter(s => Game.getObjectById(s))
    if (!room.memory.TaskCenter) room.memory.TaskCenter = []
    if (!room.memory.TaskSpawn) room.memory.TaskSpawn = []
    if (!room.memory.TaskTransport) room.memory.TaskTransport = []
    if (!room.memory.TaskWork) room.memory.TaskWork = []
    if (!room.memory.transporterList) room.memory.transporterList = []
    if (!room.memory.workerList) room.memory.workerList = []
}

function collectRoomStats(controller) {
    if (Game.time % 10) return
    Memory.stats.rooms[controller.room.name].rcl = controller.level
    Memory.stats.rooms[controller.room.name].rclPercent = (controller.progress / (controller.progressTotal || 1)) * 100
    Memory.stats.rooms[controller.room.name].energy = controller.room[RESOURCE_ENERGY] // wheel_structureCache.js
}

function visualTaskDetails(room) {
    let visualTextY = 2
    let text = 'TaskCenter : ' + room.memory['TaskCenter'].map(i => `[${i.data.source}->${i.data.target}: ${i.data.resourceType}*${i.data.amount}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskSpawn : ' + room.memory['TaskSpawn'].map(i => `[${i.data.role}: ${i.key}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskTransport : ' + room.memory['TaskTransport'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskWork : ' + room.memory['TaskWork'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
}

function onLevelChange(controller) {
    const level = controller.level
    if (Game.time % 100 || controller.room.memory.rcl === level) return
    controller.room.memory.rcl = level
    // TODO this.room.updateLayout()
    if (level === 1) {
        controller.room.source.forEach(s => !s.pos.lookFor(LOOK_FLAGS)[0] && s.pos.createFlag(undefined, COLOR_YELLOW, COLOR_YELLOW))
    } else if (level === 2) {
        //
    } else if (level === 3) {
        //
    } else if (level === 4) {
        //
    } else if (level === 5) {
        //
    } else if (level === 6) {
        //
    } else if (level === 7) {
        //
    } else if (level === 8) {
        //
    }
}
