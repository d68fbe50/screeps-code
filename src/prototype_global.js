Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && (global[i.name.toLowerCase()] = i))

const { updateAvoidRooms } = require('./wheel_move')

const logHistory = []
global.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    content = prefix + content
    if (type === 'error') content = Game.time + '<text style="color:red">&nbsp;[ERROR]&nbsp;</text>' + content
    else if (type === 'warning') content = Game.time + '<text style="color:yellow">&nbsp;[WARNING]&nbsp;</text>' + content
    else if (type === 'info') content = Game.time + '<text style="color:lightblue">&nbsp;[INFO]&nbsp;</text>' + content
    console.log(content)
    if (notifyNow) Game.notify(content)
    if (logHistory.length >= 1000) logHistory.shift()
    logHistory.push(content)
}

global.hLog = function (amount = 10) {
    if (amount > logHistory.length) amount = logHistory.length
    return logHistory.slice(amount * -1).join('\n')
}

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

global.get = function (id) {
    return Game.getObjectById(id)
}

global.res = function () {
    return HelperRoomResource.showAllRes()
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

Object.defineProperty(global, 'help', {
    get() {
        return showHelp()
    },
    configurable: true
})

function showHelp() {
    return 'help: TODO'
}
