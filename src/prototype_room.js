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

Room.prototype.cbo = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_BUY, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.cso = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_SELL, price, totalAmount, resourceType, roomName: this.name})
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

let tmpTick
Room.prototype.unclaimRoom = function (confirm) { // 防止 not defined 错误
    if (!confirm) return false
    if (tmpTick !== Game.time - 1) {
        tmpTick = Game.time
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        return
    }
    // TODO
    this.controller.unclaim()
    log(`room: ${this.name} 已移除！`, 'error')
    log(`room: ${this.name} 已移除！`, 'error')
    log(`room: ${this.name} 已移除！`, 'error')
}
