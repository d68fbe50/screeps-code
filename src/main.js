require('./main_mount')
const roles = require('./role')

!('sim' in Game.rooms) && console.log('[全局重置]')

module.exports.loop = function () {
    handleNotExistCreep()
    handleNotExistFlag()

    Object.values(Game.rooms).forEach(i => i.my && i.checkRoomMemory && i.checkRoomMemory())
    Object.values(Game.structures).forEach(i => i.run && i.run())
    Object.values(Game.creeps).forEach(i => i.run && i.run())
    Object.values(Game.powerCreeps).forEach(i => i.run && i.run())
    Object.values(Game.flags).forEach(i => i.run && i.run())
    Object.values(Game.rooms).forEach(i => i.my && i.roomVisual && i.roomVisual())

    if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel && Game.cpu.generatePixel()

    collectStats()

    // tmp
    if ('sim' in Game.rooms) return
    const creep = new RoomPosition(15, 15, 'W49S9').creep
    if (creep && creep.memory.role === 'upgrader') creep.move(BOTTOM)
}

function handleNotExistCreep() {
    if (!Memory.allCreeps) Memory.allCreeps = []
    for (const creepName in Memory.creeps) {
        if (Game.creeps[creepName]) continue
        const creepMemory = Memory.creeps[creepName]
        const { role, home, config, dontNeed } = creepMemory
        const roleRequire = roles[role] && roles[role].require
        if (!roleRequire || (roleRequire.isNeed && !roleRequire.isNeed(creepMemory)) || dontNeed) {
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

function handleNotExistFlag() {
    for (const flagName in Memory.flags) {
        if (Game.flags[flagName]) continue
        delete Memory.flags[flagName]
        log(`remove deleted flag memory: ${flagName}`)
    }
}

function collectStats() {
    if (Game.time % 10) return
    if (!Memory.stats) Memory.stats = {}
    Memory.stats.gcl = Game.gcl.level
    Memory.stats.gpl = Game.gpl.level
    Memory.stats.gclPercent = Game.gcl.progress / Game.gcl.progressTotal * 100
    Memory.stats.gplPercent = Game.gpl.progress / Game.gpl.progressTotal * 100
    Memory.stats.cpu = Game.cpu.getUsed()
    Memory.stats.cpuLimit = Game.cpu.limit
    Memory.stats.bucket = Game.cpu.bucket
    Memory.stats.credit = Game.market.credits
    Object.values(Game.rooms).forEach(i => i.my && i.collectRoomStats && i.collectRoomStats())
}
