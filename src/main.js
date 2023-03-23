require('./mount')
const { roleRequires } = require('./prototype_creep')

console.log('[全局重置]')

module.exports.loop = function () {
    checkMemory()

    Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && i.controller.run && i.controller.run())
    Object.values(Game.structures).forEach(i => i.structureType !== STRUCTURE_CONTROLLER && i.run && i.run())
    Object.values(Game.creeps).forEach(i => i.run && i.run())
    Object.values(Game.powerCreeps).forEach(i => i.run && i.run())
    Object.values(Game.flags).forEach(i => i.run && i.run())

    handleNotExistCreep()
    clearFlag()

    if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel && Game.cpu.generatePixel()
}

function checkMemory() {
    if (!Memory.allCreepNames) Memory.allCreepNames = []
}

function handleNotExistCreep() {
    for (const creepName in Memory.creeps) {
        if (Game.creeps[creepName]) continue
        const creepMemory = Memory.creeps[creepName]
        const { role, home, config, dontNeed } = creepMemory
        const roleRequire = roleRequires[role]
        if (!roleRequire || dontNeed || (roleRequire.isNeed && !roleRequire.isNeed(creepMemory))) {
            delete Memory.creeps[creepName]
            Memory.allCreepNames = _.pull(Memory.allCreepNames, creepName)
            log(`unallowed spawn creep: ${creepName}`, 'notify')
            continue
        }
        const creepHome = Game.rooms[home]
        creepHome && creepHome.addSpawnTask(creepName, undefined, { role, home, config })
        delete Memory.creeps[creepName]
    }
}

function clearFlag() {
    if (Game.time % 5) return
    for (const flagName in Memory.flags) {
        if (Game.flags[flagName]) continue
        delete Memory.flags[flagName]
        log(`remove deleted flag memory: ${flagName}`, 'notify')
    }
}
