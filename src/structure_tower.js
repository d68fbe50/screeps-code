const repairInterval = 3
const repairHitsPercent = 0.5
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
    if (!tower.room._towerRepairTargets) {
        tower.room._towerRepairTargets = [...tower.room.rampart.filter(i => i.hits < repairWallHitsMax), ...tower.room.road.filter(i => i.hits / i.hitsMax < repairHitsPercent)]
    }
    if (tower.room._towerRepairTargets.length === 0) return false
    tower.repair(tower.pos.findClosestByRange(tower.room._towerRepairTargets))
    return true
}
