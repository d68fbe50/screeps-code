Structure.prototype.log = function (content, type, notifyNow) {
    this.room.log(content, `[${this.pos.x},${this.pos.y}] [${this.structureType}]`, type, notifyNow)
}
