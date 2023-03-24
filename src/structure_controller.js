StructureController.prototype.run = function () {
    checkRoomMemory(this.room)
    visualTaskText(this.room)

    if (!(Game.time % 3)) {
        if (this.room.energyAvailable < this.room.energyCapacityAvailable) this.room.addTransportTask('fillExtension')
    }

    if (!(Game.time % 10)) {
        Memory.stats.rooms[this.room.name].rcl = this.level
        Memory.stats.rooms[this.room.name].rclPercent = (this.progress / (this.progressTotal || 1)) * 100
        Memory.stats.rooms[this.room.name].energy = this.room[RESOURCE_ENERGY] // wheel_structureCache.js
    }

    if (Game.time % 100 || this.room.memory.rcl === this.level) return
    this.room.memory.rcl = this.level
    // TODO this.room.updateLayout()
    if (this.level === 1) {
        this.room.find(FIND_SOURCES).forEach(i => !i.pos.lookFor(LOOK_FLAGS)[0] && i.pos.createFlag(undefined, COLOR_YELLOW, COLOR_YELLOW))
    } else if (this.level === 2) {
        //
    } else if (this.level === 3) {
        //
    } else if (this.level === 4) {
        //
    } else if (this.level === 5) {
        //
    } else if (this.level === 6) {
        //
    } else if (this.level === 7) {
        //
    } else if (this.level === 8) {
        //
    }
}

function checkRoomMemory(room) {
    if (!Memory.stats.rooms[room.name]) Memory.stats.rooms[room.name] = {}
    if (!room.memory.centerPos) room.memory.centerPos = {}
    if (!room.memory.TaskCenterTransport) room.memory.TaskCenterTransport = []
    if (!room.memory.TaskSpawn) room.memory.TaskSpawn = []
    if (!room.memory.TaskTransport) room.memory.TaskTransport = []
    if (!room.memory.TaskWork) room.memory.TaskWork = []
    if (!room.memory.transporterList) room.memory.transporterList = []
    if (!room.memory.workerList) room.memory.workerList = []
}

function visualTaskText(room) {
    let visualTextY = 2
    room.visual.text(room.printTaskKeys('TaskCenterTransport'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printTaskKeys('TaskSpawn'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printTaskKeys('TaskTransport'), 1, visualTextY++, { align: 'left' })
    room.visual.text(room.printTaskKeys('TaskWork'), 1, visualTextY++, { align: 'left' })
}
