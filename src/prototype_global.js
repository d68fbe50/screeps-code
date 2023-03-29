const { updateAvoidRooms } = require('./wheel_move')

const logHistory = []
const logHistoryLimit = 1000

global.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    content = prefix + content
    if (type === 'error') content = '<text style="color:red">[ERROR]&nbsp;</text>' + content
    else if (type === 'warning') content = '<text style="color:yellow">[WARNING]&nbsp;</text>' + content
    else if (type === 'info') content = '<text style="color:lightblue">[INFO]&nbsp;</text>' + content
    console.log(content)
    if (notifyNow) Game.notify(content)
    if (logHistory.length >= logHistoryLimit) logHistory.shift()
    logHistory.push(content)
}

global.hLog = function (amount = 10) {
    if (amount > logHistory.length) amount = logHistory.length
    console.log(logHistory.slice(amount * -1).join('\n'))
}

// =================================================================================================== Avoid Rooms

global.addAvoidRoom = function (roomName) {
    Memory.avoidRooms = _.uniq([...Memory.avoidRooms, roomName])
    updateAvoidRooms()
    log(`房间：${roomName} 设置为绕过`)
}

global.removeAvoidRoom = function (roomName) {
    Memory.avoidRooms = _.pull(Memory.avoidRooms, roomName)
    updateAvoidRooms()
    log(`房间：${roomName} 恢复为可通行`)
}

// =================================================================================================== Fast Access

Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && (global[i.name.toLowerCase()] = i))

global.get = function (id) {
    return Game.getObjectById(id)
}

Object.defineProperty(global, 'c', {
    get() { return Game.creeps },
    configurable: true
})

Object.defineProperty(global, 'f', {
    get() { return Game.flags },
    configurable: true
})

Object.defineProperty(global, 'm', {
    get() { return Game.market },
    configurable: true
})

Object.defineProperty(global, 'pc', {
    get() { return Game.powerCreeps },
    configurable: true
})

Object.defineProperty(global, 'r', {
    get() { return Game.rooms },
    configurable: true
})

Object.defineProperty(global, 't', {
    get() { return Game.time },
    configurable: true
})

// =================================================================================================== Market

global.cop = function (orderId, newPrice) {
    return Game.market.changeOrderPrice(orderId, newPrice)
}

global.eo = function (orderId, addAmount) {
    return Game.market.extendOrder(orderId, addAmount)
}

global.res = function () {
    return HelperRoomResource.showAllRes()
}

// =================================================================================================== Visual Path

global.offVisualPath = function () {
    delete Memory.isVisualPath
}

global.onVisualPath = function () {
    Memory.isVisualPath = true
}
