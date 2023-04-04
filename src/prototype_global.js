global.energy = RESOURCE_ENERGY
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

global.allRes = function () {
    return HelperRoomResource.showAllRes()
}

global.eachRoom = function (func) {
    let result = ''
    Object.values(Game.rooms).forEach(i => i.my && (result += `[${i.name}]:\n${func(i)}\n\n`))
    return result
}

global.get = function (id) {
    return Game.getObjectById(id)
}

global.hLog = function (amount = 10) {
    if (amount > logHistory.length) amount = logHistory.length
    return logHistory.slice(amount * -1).join('\n')
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

Object.values(Game.rooms).forEach(i => {
    if (i.my) global[i.name.toLowerCase()] = i
})

function showHelp() {
    return 'help: TODO'
}
