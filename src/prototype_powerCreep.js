PowerCreep.prototype.log = function (content, type = 'info', notifyNow = false) {
    this.say(content)
    this.room.log(content, type, notifyNow, `[powerCreep:${this.name},${this.pos.x},${this.pos.y}]&nbsp;`)
}
