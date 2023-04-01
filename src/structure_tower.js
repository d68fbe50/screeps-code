const repairInterval = 3
const repairHitsPercent = 0.5

StructureTower.prototype.run = function () {
    if (this.energy < this.capacity / 2) this.room.addTransportTask('fillTower')
    if (this.energy < 10) return
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
        tower.room._towerRepairTargets = [...tower.room.rampart.filter(i => i.hits <= 301), ...tower.room.road.filter(i => i.hits / i.hitsMax < repairHitsPercent)]
    }
    if (tower.room._towerRepairTargets.length === 0) return false
    tower.repair(tower.pos.findClosestByRange(tower.room._towerRepairTargets))
    return true
}

Object.defineProperty(Room.prototype, 'hostiles', {
    get() {
        if (!this._hostiles) this._hostiles = this.find(FIND_HOSTILE_CREEPS)
        return this._hostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'hostileStructures', {
    get() {
        if (!this._hostileStructures) this._hostileStructures = this.find(FIND_HOSTILE_STRUCTURES, { filter: i => i.hitsMax })
        return this._hostileStructures
    },
    configurable: true
})
