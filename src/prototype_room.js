const { LAYOUT_DATA } = require('./config_layout')

Room.prototype.log = function (content, type, notifyNow, prefix) {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]</a>${prefix ? prefix : ''}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.setCenterPos = function (centerPosX, centerPosY) {
    this.memory.centerPos.x = centerPosX
    this.memory.centerPos.y = centerPosY
    this.log(`房间中心点已设置为 [${centerPosX},${centerPosY}]`, 'success')
}

Room.prototype.visualLayout = function (centerPosX = 25, centerPosY = 25) {
    Object.keys(LAYOUT_DATA).forEach(l => {
        Object.keys(LAYOUT_DATA[l]).forEach(s => {
            LAYOUT_DATA[l][s].forEach(p => {
                this.visual.structure(p[0]-25+centerPosX, p[1]-25+centerPosY, s)
            })
        })
    })
    this.visual.connectRoads()
}

Object.defineProperty(Room.prototype, 'my', {
    get: function () { return this.controller && this.controller.my },
    set: function () {},
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'level', {
    get: function () { return this.controller && this.controller.level },
    set: function () {},
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'centerLink', {
    get: function () { return this.memory.centerLinkId && Game.getObjectById(this.memory.centerLinkId) },
    set: function () {},
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'upgradeLink', {
    get: function () { return this.memory.upgradeLinkId && Game.getObjectById(this.memory.upgradeLinkId) },
    set: function () {},
    enumerable: false,
    configurable: true
})
