Creep.prototype.log = function (content, type, notifyNow) {
    this.say(content)
    this.room.log(content, type, notifyNow, `[${this.pos.x},${this.pos.y}] [powerCreep: ${this.name}]`)
}
