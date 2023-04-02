const TASK_TYPE = 'TaskWork'

const workTaskConfigs = {
    build: { priority: 9, minUnits: 1, maxUnits: 5 },
    repair: { priority: 6, minUnits: 0, maxUnits: 1 },
    upgrade: { priority: 3, minUnits: 0, maxUnits: 10 }
}

Room.prototype.addWorkTask = function (key) {
    if (!(key in workTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = workTaskConfigs[key]
    return this.addTask(TASK_TYPE, key, {}, priority, 0, minUnits, 0, maxUnits)
}

const build = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.buildStructure()
        if (result) return ERR_NOT_FOUND
        creep.memory.dontPullMe = true
        return false
    }
}

const repair = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.repairWall()
        if (result) return ERR_NOT_FOUND
        creep.memory.dontPullMe = true
        return false
    }
}

const upgrade = {
    source: (creep) => creep.getEnergy(),
    target: (creep) => {
        if (creep.isEmpty) {
            delete creep.memory.dontPullMe
            return true
        }
        const result = creep.upgrade()
        if (result === OK) creep.memory.dontPullMe = true
        return false
    }
}

module.exports = { build, repair, upgrade }

Creep.prototype.buildStructure = function () {
    const csId = this.room.memory.constructionSiteId
    const cs = Game.getObjectById(csId)
    if (cs) {
        this.buildTo(cs)
        return false
    }
    if (csId) {
        const pos = this.room.memory.constructionSitePos && new RoomPosition(this.room.memory.constructionSitePos.x, this.room.memory.constructionSitePos.y, this.room.name)
        const newStructure = pos && pos.structures.find(i => i.structureType === this.room.memory.constructionSiteType)
        if (newStructure) newStructure.onBuildComplete && newStructure.onBuildComplete()
        delete this.room.memory.constructionSiteId
        delete this.room.memory.constructionSiteType
        delete this.room.memory.constructionSitePos
        this.room.update()
        return false
    }
    const importantCs = this.room.constructionSites.find(i => [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(i.structureType))
    const closestCs = importantCs ? importantCs : this.pos.findClosestByRange(this.room.constructionSites)
    if (closestCs) {
        this.room.memory.constructionSiteId = closestCs.id
        this.room.memory.constructionSiteType = closestCs.structureType
        this.room.memory.constructionSitePos = { x: closestCs.pos.x, y: closestCs.pos.y }
        return false
    } else return true
}

Creep.prototype.repairWall = function () {
    const needRepairWallId = this.room.memory.needRepairWallId
    if (!(Game.time % 300) || !needRepairWallId) {
        const minHitsWall = [...this.room.wall, ...this.room.rampart]
            .filter(i => i.hits < i.hitsMax / 25)
            .sort((a, b) => a.hits - b.hits)[0]
        if (minHitsWall) this.room.memory.needRepairWallId = minHitsWall.id
        else {
            delete this.room.memory.needRepairWallId
            return true
        }
    }
    const needRepairWall = Game.getObjectById(this.room.memory.needRepairWallId)
    if (!needRepairWall) {
        delete this.room.memory.needRepairWallId
        return false
    }
    this.repairTo(needRepairWall)
    return false
}
