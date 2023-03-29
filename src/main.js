require('./mount')
const { roleRequires } = require('./prototype_creep')
const { manageDelayTask } = require('./utils_delayQueue')

!('sim' in Game.rooms) && console.log('[全局重置]')
if (!Memory.rooms) Memory.rooms = {}
if (!Memory.creeps) Memory.creeps = {}

module.exports.loop = function () {
    checkMemory()

    Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && i.controller.run && i.controller.run())
    Object.values(Game.structures).forEach(i => i.structureType !== STRUCTURE_CONTROLLER && i.run && i.run())
    Object.values(Game.creeps).forEach(i => i.run && i.run())
    Object.values(Game.powerCreeps).forEach(i => i.run && i.run())
    Object.values(Game.flags).forEach(i => i.run && i.run())

    handleNotExistCreep()
    manageDelayTask()
    clearFlag()
    collectStats()

    if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel && Game.cpu.generatePixel()
}

function checkMemory() {
    if (!Memory.allCreeps) Memory.allCreeps = []
    if (!Memory.avoidRooms) Memory.avoidRooms = []
    if (!Memory.delayTasks) Memory.delayTasks = []
    if (!Memory.stats) Memory.stats = {}
    // if (!Memory.stats.rooms) Memory.stats.rooms = {}
}

function handleNotExistCreep() {
    for (const creepName in Memory.creeps) {
        if (Game.creeps[creepName]) continue
        const creepMemory = Memory.creeps[creepName]
        const { role, home, config, dontNeed } = creepMemory
        const roleRequire = roleRequires[role]
        if (!roleRequire || (roleRequire.isNeed && !roleRequire.isNeed(creepMemory, creepName)) || dontNeed) { // 注意顺序
            delete Memory.creeps[creepName]
            Memory.allCreeps = _.pull(Memory.allCreeps, creepName)
            log(`unallowed spawn creep: ${creepName}`)
            continue
        }
        const creepHome = Game.rooms[home]
        creepHome && creepHome.addSpawnTask(creepName, { role, home, config })
        delete Memory.creeps[creepName]
    }
}

function clearFlag() {
    for (const flagName in Memory.flags) {
        if (Game.flags[flagName]) continue
        delete Memory.flags[flagName]
        log(`remove deleted flag memory: ${flagName}`)
    }
}

function collectStats() {
    if (Game.time % 10) return
    Memory.stats.gcl = Game.gcl.level
    Memory.stats.gpl = Game.gpl.level
    Memory.stats.gclPercent = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    Memory.stats.gplPercent = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    Memory.stats.cpu = Game.cpu.getUsed()
    Memory.stats.cpuLimit = Game.cpu.limit
    Memory.stats.bucket = Game.cpu.bucket
    Memory.stats.credit = Game.market.credits
}
