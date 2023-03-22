require('./mount')

console.log('[全局重置]')

module.exports.loop = function () {
    Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && i.controller.run && i.controller.run())
    Object.values(Game.structures).forEach(i => i.structureType !== STRUCTURE_CONTROLLER && i.run && i.run())
    Object.values(Game.creeps).forEach(i => i.run && i.run())
    Object.values(Game.powerCreeps).forEach(i => i.run && i.run())

    if (Game.cpu.bucket >= 10000) Game.cpu.generatePixel && Game.cpu.generatePixel()
}
