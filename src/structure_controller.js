const { addDelayTask, addDelayCallback } = require('./utils_delayQueue')

const buildCheckInterval = 10
const wallCheckInterval = 10
const wallRepairHitsMax = 10000

StructureController.prototype.run = function () {
    checkRoomMemory(this.room)
    this.room.container.forEach(i => i.run && i.run())
    if (!(Game.time % buildCheckInterval)) this.room.constructionSites.length > 0 && this.room.addWorkTask('build', 1, 3)
    if (!(Game.time % wallCheckInterval)) [...this.room.wall, ...this.room.rampart].find(i => i.hits < wallRepairHitsMax) && this.room.addWorkTask('repair', 1, 3)
    onLevelChange(this)
    visualTaskDetails(this.room)
    collectRoomStats(this)
}

function checkRoomMemory(room) {
    if (!Memory.stats.rooms[room.name]) Memory.stats.rooms[room.name] = {}
    if (!room.memory.centerPos) room.memory.centerPos = {}
    if (!room.memory.sourceContainerIds) room.memory.sourceContainerIds = []
    if (!room.memory.TaskCenter) room.memory.TaskCenter = []
    if (!room.memory.TaskSpawn) room.memory.TaskSpawn = []
    if (!room.memory.TaskTransport) room.memory.TaskTransport = []
    if (!room.memory.TaskWork) room.memory.TaskWork = []
    if (!room.memory.remoteLocks) room.memory.remoteLocks = {}
    if (!room.memory.transporters) room.memory.transporters = []
    if (!room.memory.workers) room.memory.workers = []
}

function onLevelChange(controller) {
    const level = controller.level
    if (controller.room.memory.rcl === level) return
    controller.room.memory.rcl = level
    controller.room.updateLayout()
    if (level === 1) {
        controller.room.source.forEach(i => !i.pos.lookFor(LOOK_FLAGS)[0] && i.pos.createFlag(undefined, COLOR_YELLOW, COLOR_YELLOW))
        controller.room.addWorkTask('upgrade', 0, 5)
        addWorkerDelay(controller.room.name, 5)
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
        controller.room.removeTask('TaskWork', 'upgrade')
    }
}

function visualTaskDetails(room) {
    let visualTextY = 25
    let text = 'TaskCenter : ' + room.memory['TaskCenter'].map(i => `[${i.data.source}->${i.data.target}: ${i.data.resourceType}*${i.data.amount}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskSpawn : ' + room.memory['TaskSpawn'].map(i => `[${i.data.role}: ${i.key}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskTransport : ' + room.memory['TaskTransport'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
    text = 'TaskWork : ' + room.memory['TaskWork'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    room.visual.text(text, 1, visualTextY++, { align: 'left' })
}

function collectRoomStats(controller) {
    if (Game.time % 10) return
    Memory.stats.rooms[controller.room.name].rcl = controller.level
    Memory.stats.rooms[controller.room.name].rclPercent = (controller.progress / (controller.progressTotal || 1)) * 100
    Memory.stats.rooms[controller.room.name].energy = controller.room[RESOURCE_ENERGY]
}

function addWorkerDelay(roomName, amount) {
    addDelayTask("addWorkerInLevel1", { roomName, amount }, Game.time + 1)
}

addDelayCallback("addWorkerInLevel1", (room, data) => {
    if (room) room.addWorker(data.amount)
})
