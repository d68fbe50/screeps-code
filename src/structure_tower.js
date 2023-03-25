const repairInterval = 3
const repairHitsRate = 0.5
const repairWallHitsMax = 10000

StructureTower.prototype.run = function () {
    if (this.energy < 10) return this.room.addTransportTask('fillTower')
    if (attackEnemy(this)) return
    repairStructure(this)
}

StructureTower.prototype.onBuildComplete = function () {
    //
}

function attackEnemy(tower) {
    if (tower.room.hostiles.length === 0) return false
    tower.attack(tower.pos.findClosestByRange(tower.room.hostiles))
    return true
}

function repairStructure(tower) {
    if (Game.time % repairInterval) return false
    if (!tower.room._towerRepairTargets) tower.room._towerRepairTargets = tower.room.structures.filter(s => {
        return (s.structureType === STRUCTURE_RAMPART && s.hits < repairWallHitsMax)
            || (s.structureType !== STRUCTURE_RAMPART && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_CONTAINER && s.hits / s.hitsMax < repairHitsRate)
    })
    if (tower.room._towerRepairTargets.length === 0) return false
    tower.repair(tower.pos.findClosestByRange(tower.room._towerRepairTargets))
    return true
}
