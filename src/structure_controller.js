StructureController.prototype.run = function() {
    let visualTextY = 2
    this.room.visual.text(this.room.printTaskKeys('TaskCenterTransport'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTaskKeys('TaskSpawn'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTaskKeys('TaskTransport'), 1, visualTextY++, { align: 'left' })
    this.room.visual.text(this.room.printTaskKeys('TaskWork'), 1, visualTextY++, { align: 'left' })
}
