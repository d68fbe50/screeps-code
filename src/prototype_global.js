global.energy = RESOURCE_ENERGY
global.power = RESOURCE_POWER
global.ops = RESOURCE_OPS
global.mineralTypes = ['O', 'H', 'Z', 'K', 'U', 'L', 'X']
global.t0Types = ['OH', 'ZK', 'UL', 'G']
global.t1Types = ['ZH', 'ZO', 'KH', 'KO', 'UH', 'UO', 'LH', 'LO', 'GH', 'GO']
global.t2Types = ['ZH2O', 'ZHO2', 'KH2O', 'KHO2', 'UH2O', 'UHO2', 'LH2O', 'LHO2', 'GH2O', 'GHO2']
global.t3Types = ['XZH2O', 'XZHO2', 'XKH2O', 'XKHO2', 'XUH2O', 'XUHO2', 'XLH2O', 'XLHO2', 'XGH2O', 'XGHO2']
global.state = { Normal: 'Normal', Defend: 'Defend', War: 'War', NukerEmergency: 'NukerEmergency', Upgrade: 'Upgrade' }

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

global.eachRoom = function (func) {
    let result = ''
    _.values(Game.rooms).forEach(i => i.my && (result += `[${i.name}]:\n${func(i)}\n\n`))
    return result
}

global.get = function (id) {
    return Game.getObjectById(id)
}

global.hLog = function (amount = 10) {
    if (amount > logHistory.length) amount = logHistory.length
    return logHistory.slice(amount * -1).join('\n')
}

Object.defineProperty(global, 'allRes', {
    get() {
        return HelperRoomResource.showAllRes()
    },
    configurable: true
})

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

_.values(Game.rooms).forEach(i => {
    if (i.controller && i.controller.my) global[i.name.toLowerCase()] = i
})

function showHelp() {
    return 'help: TODO'
}
