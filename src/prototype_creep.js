const roadHitsPercent = 0.5
const wallFocusTime = 100
const wallHitsMax = 100000

const roleRequires = { // 注意与 prototype_taskQueue.js 的 spawnTaskTypes 保持一致
    centerTransporter: require('./role_centerTransporter'),
    claimer: require('./role_claimer'),
    defender: require('./role_defender'),
    depoDefender: require('./role_depoDefender'),
    depoHarvester: require('./role_depoHarvester'),
    depoTransporter: require('./role_depoTransporter'),
    harvester: require('./role_harvester'),
    helper: require('./role_helper'),
    mineHarvester: require('./role_mineHarvester'),
    powerAttacker: require('./role_powerAttacker'),
    powerDefender: require('./role_powerDefender'),
    powerHealer: require('./role_powerHealer'),
    powerTransporter: require('./role_powerTransporter'),
    remoteHarvester: require('./role_remoteHarvester'),
    remoteDefender: require('./role_remoteDefender'),
    remoteTransporter: require('./role_remoteTransporter'),
    reserver: require('./role_reserver'),
    squadAttacker: require('./role_squadAttacker'),
    squadDismantler: require('./role_squadDismantler'),
    squadHealer: require('./role_squadHealer'),
    squadRanged: require('./role_squadRanged'),
    transporter: require('./role_transporter'),
    upgrader: require('./role_upgrader'),
    worker: require('./role_worker')
}

Creep.prototype.log = function (content, type, notifyNow) {
    this.say(content)
    this.room.log(content, type, notifyNow, `[${this.pos.x},${this.pos.y}] [${this.name}]`)
}

Creep.prototype.run = function () {
    if (this.spawning) return

    const roleRequire = roleRequires[this.memory.role]
    if (!roleRequire) return this.log('no role!', 'error')

    if (!this.memory.config) this.memory.config = {}
    if (!this.memory.task) this.memory.task = {}

    if (!this.memory.ready) {
        if (roleRequire.prepare) this.memory.ready = roleRequire.prepare(this)
        else this.memory.ready = true
    }
    if (!this.memory.ready) return

    if (roleRequire.deathPrepare && roleRequire.deathPrepare(this)) return

    const working = roleRequire.source ? this.memory.working : true
    if (working) roleRequire.target && roleRequire.target(this) && (this.memory.working = !this.memory.working)
    else roleRequire.source && roleRequire.source(this) && (this.memory.working = !this.memory.working)
}

Creep.prototype.clearResources = function (excludeResourceType) { // 置空抛所有
    if (this.isEmpty || this.store.getUsedCapacity() === this.store[excludeResourceType]) return true
    const resourceType = Object.keys(this.store).find(i => i !== excludeResourceType && this.store[i] > 0)
    const putTarget = this.room.terminal ? this.room.terminal : this.room.storage
    if (putTarget) this.putTo(putTarget, resourceType)
    else this.drop(resourceType)
    return false
}

// task func -------------------------------------------------------------------------------------

Creep.prototype.receiveTask = function (type) {
    const task = this.room.getExpectTask(type)
    if (task) {
        this.memory.task = { key: task.key }
        this.room.updateTaskUnit(type, task.key, 1)
    }
    return task
}

Creep.prototype.revertTask = function (type) {
    this.room.updateTaskUnit(type, this.memory.task.key, -1)
    this.memory.task = {}
    return true
}

// senior behavior ------------------------------------------------------------------------------

Creep.prototype.getEnergy = function (ignoreLimit = false, includeSource = true, energyPercent = 1) {
    if (this.energy / this.store.getCapacity() >= energyPercent) {
        delete this.memory.energySourceId
        delete this.memory.dontPullMe
        return true
    }
    if (!this.clearResources(RESOURCE_ENERGY)) return false
    if (!this.memory.energySourceId) {
        const energySources = this.room.getEnergySources(ignoreLimit, includeSource)
        this.memory.energySourceId = energySources.length > 1 ? this.pos.findClosestByRange(energySources).id : (energySources[0] && energySources[0].id)
    }
    const energySource = Game.getObjectById(this.memory.energySourceId)
    if (!energySource) {
        delete this.memory.energySourceId
        return false
    }
    const result = this.getFrom(energySource)
    if (result === OK) {
        if (energySource && energySource.energyCapacity) this.memory.dontPullMe = true // 采矿时禁止对穿
    }
    else if (result === ERR_NOT_ENOUGH_ENERGY || result === ERR_NOT_ENOUGH_RESOURCES) delete this.memory.energySourceId
    return false
}

Creep.prototype.buildStructure = function () {
    const csId = this.room.memory.constructionSiteId
    const cs = Game.getObjectById(csId)
    if (cs) {
        this.buildTo(cs)
        return true
    }
    if (csId) {
        const pos = this.room.memory.constructionSitePos && new RoomPosition(this.room.memory.constructionSitePos.x, this.room.memory.constructionSitePos.y, this.room.name)
        const newStructure = pos && pos.lookFor(LOOK_STRUCTURES).find(i => i.structureType === this.room.memory.constructionSiteType)
        if (newStructure) newStructure.onBuildComplete && newStructure.onBuildComplete()
        delete this.room.memory.constructionSiteId
        delete this.room.memory.constructionSiteType
        delete this.room.memory.constructionSitePos
        this.room.update()
        return true
    }
    const importantCs = this.room.constructionSites.find(i => [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(i.structureType))
    const closestCs = importantCs ? importantCs : this.pos.findClosestByRange(this.room.constructionSites)
    if (closestCs) {
        this.room.memory.constructionSiteId = closestCs.id
        this.room.memory.constructionSiteType = closestCs.structureType
        this.room.memory.constructionSitePos = { x: closestCs.pos.x, y: closestCs.pos.y }
        return true
    } else return false
}

Creep.prototype.repairWall = function () {
    const needRepairWallId = this.room.memory.needRepairWallId
    if (!(Game.time % wallFocusTime) || !needRepairWallId) {
        const minHitsWall = [...this.room.wall, ...this.room.rampart]
            .filter(i => i.hits < wallHitsMax)
            .sort((a, b) => a.hits - b.hits)[0]
        if (minHitsWall) this.room.memory.needRepairWallId = minHitsWall.id
        else {
            delete this.room.memory.needRepairWallId
            return false
        }
    }
    const needRepairWall = Game.getObjectById(this.room.memory.needRepairWallId)
    if (!needRepairWall) {
        delete this.room.memory.needRepairWallId
        return true
    }
    this.repairTo(needRepairWall)
    return true
}

// base behavior -------------------------------------------------------------------------------

Creep.prototype.getFrom = function (target, resourceType = RESOURCE_ENERGY, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
    }
    return result
}

Creep.prototype.putTo = function (target, resourceType = RESOURCE_ENERGY, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
    }
    return result
}

Creep.prototype.repairRoad = function () {
    if (this.room.my && this.room.tower.length > 0) return false
    const road = this.pos.lookForStructure(STRUCTURE_ROAD)
    if (road && road.hits / road.hitsMax < roadHitsPercent) return this.repair(road)
}

Creep.prototype.buildTo = function (target) {
    const result = this.build(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
        this.repairRoad()
    }
    return result
}

Creep.prototype.dismantleTo = function (target) {
    const result = this.dismantle(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
    }
    return result
}

Creep.prototype.repairTo = function (target) {
    const result = this.repair(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
        this.repairRoad()
    }
    return result
}

Creep.prototype.upgrade = function (target) {
    if (!target) target = this.room.controller
    const result = this.upgradeController(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target, {range: 3})
        this.repairRoad()
    }
    return result
}

Creep.prototype.claim = function (target) {
    if (!target) target = this.room.controller
    const result = this.claimController(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
    }
    return result
}

Creep.prototype.reserve = function (target) {
    if (!target) target = this.room.controller
    const result = this.reserveController(target)
    if (result === ERR_NOT_IN_RANGE) {
        if (Memory.isVisualPath) this.room.visual.line(this.pos, target && target.pos, { width: 0.05 })
        this.moveTo(target)
    }
    return result
}

// Creep Property -------------------------------------------------------------------------------

Object.defineProperty(Creep.prototype, 'boosts', {
    get() {
        if (!this._boosts) {
            this._boosts = _.compact(_.unique(_.map(this.body, i => i.boost)))
        }
        return this._boosts
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'boostCounts', {
    get() {
        if (!this._boostCounts) {
            this._boostCounts = _.countBy(this.body, i => i.boost)
        }
        return this._boostCounts
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'energy', {
    get() {
        return this.store[RESOURCE_ENERGY]
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'isEmpty', {
    get() {
        return this.store.getUsedCapacity() <= 0
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'isFull', {
    get() {
        return this.store.getFreeCapacity() <= 0
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'inRampart', {
    get() {
        return !!this.pos.lookForStructure(STRUCTURE_RAMPART)
    },
    configurable: true
})

module.exports = { roleRequires }
