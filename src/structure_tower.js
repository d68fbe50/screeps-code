const repairInterval = 3
const repairRoadHitsRate = 0.5
const repairWallMaxHits = 10000

StructureTower.prototype.run = function () {
    if (this.store[RESOURCE_ENERGY] < 10) return this.room.addTransportTask('fillTower')
    if (attackEnemy(this)) return
    repairStructure(this)
}

StructureTower.prototype.onBuildComplete = function () {
    //
}

function attackEnemy(tower) {
    if (!tower.room._enemies) tower.room._enemies = tower.room.find(FIND_HOSTILE_CREEPS)
    if (tower.room._enemies.length === 0) return false
    tower.attack(tower.pos.findClosestByRange(tower.room._enemies))
    return true
}

function repairStructure(tower) {
    if (Game.time % repairInterval) return false
    if (!tower.room._towerRepairTargets) tower.room._towerRepairTargets = tower.room.find(FIND_STRUCTURES, {
        filter: i => (i.structureType === STRUCTURE_ROAD && i.hits / i.hitsMax < repairRoadHitsRate)
            || (i.structureType === STRUCTURE_RAMPART && i.hits < repairWallMaxHits)
            || (i.structureType === STRUCTURE_WALL && i.hits < repairWallMaxHits)
            || (i.structureType !== STRUCTURE_ROAD && i.structureType !== STRUCTURE_RAMPART && i.structureType !== STRUCTURE_WALL && i.hits < i.hitsMax)
    })
    if (tower.room._towerRepairTargets.length === 0) return false
    tower.repair(tower.pos.findClosestByRange(tower.room._towerRepairTargets))
    return true
}
