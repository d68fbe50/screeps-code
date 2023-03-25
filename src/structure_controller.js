StructureController.prototype.run = function () {
    checkRoomMemory(this.room)
    collectRoomStats(this)
    visualTaskText(this.room)
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
    if (!room.memory.TaskCenterTransport) room.memory.TaskCenterTransport = []
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

function visualTaskText(room) {
    let visualTextY = 2
    room.visual.text(room.printAllTasks('TaskCenterTransport'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printAllTasks('TaskSpawn'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printAllTasks('TaskTransport'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printAllTasks('TaskWork'), 1, visualTextY++, { align: 'left' })
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
