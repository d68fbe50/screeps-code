Structure.prototype.log = function (content, type, notifyNow) {
    this.room.log(content, type, notifyNow, `[${this.pos.x},${this.pos.y}] [${this.structureType}]`)
}
