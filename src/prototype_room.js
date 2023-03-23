Room.prototype.log = function (content, type, notifyNow, prefix) {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]</a> ${prefix ? prefix : ''}`
    log(content, type, notifyNow, prefix)
}

Object.defineProperty(Room.prototype, 'centerLink', {
    get: function () {
        return this.memory.centerLinkId && Game.getObjectById(this.memory.centerLinkId)
    },
    set: function () {
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'upgradeLink', {
    get: function () {
        return this.memory.upgradeLinkId && Game.getObjectById(this.memory.upgradeLinkId)
    },
    set: function () {
    },
    enumerable: false,
    configurable: true
})
