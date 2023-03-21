StructureController.prototype.run = function() {
    if (!Memory.rooms) Memory.rooms = {}
    if (!Memory.rooms[this.room.name]) Memory.rooms[this.room.name] = {}

    let visualTextY = 2
    this.room.visual.text(this.room.printTasksKeys('TaskCenterTransport'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTasksKeys('TaskSpawn'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTasksKeys('TaskTransport'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTasksKeys('TaskWork'), 1, visualTextY++, { align: 'left' })
}
