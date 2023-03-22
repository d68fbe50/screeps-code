require('./mount')
const { roleRequires } = require('./prototype_creep')

console.log('[全局重置]')

module.exports.loop = function () {
    Object.values(Game.structures).forEach(i => i.run && i.run())
    Object.values(Game.creeps).forEach(i => i.run && i.run())
    Object.values(Game.powerCreeps).forEach(i => i.run && i.run())

    handleNotExistCreep()

    if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel && Game.cpu.generatePixel()
}

function handleNotExistCreep() {
    for (const creepName in Memory.creeps) {
        if (Game.creeps[creepName]) continue
        const creepMemory = Memory.creeps[creepName]
        const { role, home, config } = creepMemory
        const roleRequire = roleRequires[role]
        if (!roleRequire || (roleRequire.isNeed && !roleRequire.isNeed(creepMemory))) {
            delete Memory.creeps[creepName]
            global.log(`unallowed spawn`, `[${creepName}]`, 'notify')
            continue
        }
        const creepHome = Game.rooms[home]
        creepHome && creepHome.addSpawnTask(creepName, undefined, { role, home, config })
        delete Memory.creeps[creepName]
    }
}
