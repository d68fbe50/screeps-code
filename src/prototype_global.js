Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && (global[i.name.toLowerCase()] = i))

const logHistory = []
const logHistoryLimit = 1000

global.log = function (content, type = 'info', notifyNow = false, prefix) {
    if (type === 'error') content = `<text style="color:red">${content}</text>`
    if (type === 'warning') content = `<text style="color:yellow">${content}</text>`
    if (type === 'notify') content = `<text style="color:lightblue">${content}</text>`
    if (type === 'success') content = `<text style="color:green">${content}</text>`
    content = `${Game.time}${prefix ? ' ' + prefix : ''} ${content}`
    console.log(content)
    if (notifyNow) Game.notify(content)
    if (logHistory.length >= logHistoryLimit) logHistory.shift()
    logHistory.push(content)
}

global.printLogHistory = function (amount = 10) {
    if (amount > logHistory.length) amount = logHistory.length
    console.log(logHistory.slice(amount * -1).join('\n'))
}

global.get = function (id) {
    return Game.getObjectById(id)
}

global.res = function () {
    return HelperRoomResource.showAllRes()
}

global.eo = function (orderId, addAmount) {
    return Game.market.extendOrder(orderId, addAmount)
}

global.cop = function (orderId, newPrice) {
    return Game.market.changeOrderPrice(orderId, newPrice)
}

Object.defineProperty(global, 'c', {
    get() { return Game.creeps },
    configurable: true
})

Object.defineProperty(global, 'm', {
    get() { return Game.market },
    configurable: true
})

Object.defineProperty(global, 'r', {
    get() { return Game.rooms },
    configurable: true
})
