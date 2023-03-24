const repairInterval = 3
const repairHitsRate = 0.5
const repairWallHitsMax = 10000

StructureTower.prototype.run = function () {
    if (this.store[RESOURCE_ENERGY] < 10) return this.room.addTransportTask('fillTower')
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
    if (!tower.room._towerRepairTargets) tower.room._towerRepairTargets = tower.room.structures.filter(i => {
        return (i.structureType === STRUCTURE_RAMPART && i.hits < repairWallHitsMax)
            || (i.structureType !== STRUCTURE_RAMPART && i.structureType !== STRUCTURE_WALL && i.structureType !== STRUCTURE_CONTAINER && i.hits / i.hitsMax < repairHitsRate)
    })
    if (tower.room._towerRepairTargets.length === 0) return false
    tower.repair(tower.pos.findClosestByRange(tower.room._towerRepairTargets))
    return true
}
