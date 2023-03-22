StructureController.prototype.run = function () {
    visualTaskText(this)

    if (!(Game.time % 3)) {
        if (this.room.energyAvailable < this.room.energyCapacityAvailable) this.room.addTransportTask('fillExtension')
    }

    if (Game.time % 100 || this.room.memory.rcl === this.level) return
    this.room.memory.rcl = this.level
    // TODO this.room.updateLayout()
    if (this.level === 1) {
        this.room.addHarvester()
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

function visualTaskText(controller) {
    let visualTextY = 2
    controller.room.visual.text(controller.room.printTaskKeys('TaskCenterTransport'), 1, visualTextY++, { align: 'left' })
    controller.room.visual.text(controller.room.printTaskKeys('TaskSpawn'), 1, visualTextY++, { align: 'left' })
    controller.room.visual.text(controller.room.printTaskKeys('TaskTransport'), 1, visualTextY++, { align: 'left' })
    controller.room.visual.text(controller.room.printTaskKeys('TaskWork'), 1, visualTextY++, { align: 'left' })
}
