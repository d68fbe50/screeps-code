Structure.prototype.log = function (content, type = 'info', notifyNow = false) {
    this.room.log(content, type, notifyNow, `[${this.structureType},${this.pos.x},${this.pos.y}]&nbsp;`)
}

Object.defineProperty(Structure.prototype, 'isWalkable', {
    get() {
        return this.structureType === STRUCTURE_ROAD
            || this.structureType === STRUCTURE_CONTAINER
            || (this.structureType === STRUCTURE_RAMPART && (this.my || this.isPublic))
    },
    configurable: true
})
