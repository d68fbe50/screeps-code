const wallFocusTime = 100
const wallHitsMax = 100000

const roleRequires = { // 注意与 prototype_taskQueue.js 的 ROLE_TYPES 保持一致
    centerTransporter: require('./role_centerTransporter'),
    claimer: require('./role_claimer'),
    defender: require('./role_defender'),
    depoDefender: require('./role_depoDefender'),
    depoHarvester: require('./role_depoHarvester'),
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
    starter: require('./role_starter'),
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

    if (!this.memory.ready) {
        if (roleRequire.prepare) this.memory.ready = roleRequire.prepare(this)
        else this.memory.ready = true
    }
    if (!this.memory.ready) return

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

Creep.prototype.receiveTask = function (taskType) {
    const task = this.room.getExpectTask(taskType)
    if (task) {
        this.memory.taskKey = task.key
        this.memory.taskBegin = Game.time
        this.room.updateTaskUnit(taskType, this.memory.taskKey, 1)
        return task
    } else return undefined
}

Creep.prototype.revertTask = function (taskType) {
    this.room.updateTaskUnit(taskType, this.memory.taskKey, -1)
    delete this.memory.taskKey
    delete this.memory.taskBegin
    return true
}

// complex behavior ------------------------------------------------------------------------------

Creep.prototype.getEnergy = function (ignoreLimit = false, includeSource = true, energyPercent = 1) {
    if (this.energy / this.store.getCapacity() >= energyPercent) {
        delete this.memory.energySourceId
        delete this.memory.dontPullMe
        return true
    }
    if (!this.clearResources(RESOURCE_ENERGY)) return false
    if (!this.memory.energySourceId) this.memory.energySourceId = this.room.getEnergySourceId(ignoreLimit, includeSource)
    const energySource = Game.getObjectById(this.memory.energySourceId)
    if (!energySource) return false
    const result = this.getFrom(energySource)
    if (result && energySource && energySource.energyCapacity) this.memory.dontPullMe = true // 采矿时禁止对穿
    return false
}

Creep.prototype.buildStructure = function () {
    const constructionSiteId = this.room.memory.constructionSiteId
    const constructionSite = Game.getObjectById(constructionSiteId)
    if (constructionSite) {
        this.buildTo(constructionSite)
        return true
    }
    if (constructionSiteId) {
        const pos = this.room.memory.constructionSitePos && new RoomPosition(this.room.memory.constructionSitePos.x, this.room.memory.constructionSitePos.y, this.room.name)
        const newStructure = pos && pos.lookFor(LOOK_STRUCTURES).find(i => i.structureType === this.room.memory.constructionSiteType)
        if (newStructure) newStructure.onBuildComplete && newStructure.onBuildComplete()
        delete this.room.memory.constructionSiteId
        delete this.room.memory.constructionSiteType
        delete this.room.memory.constructionSitePos
        this.room.update()
        return true
    }
    const closestConstructionSite = this.pos.findClosestByRange(this.room.constructionSites)
    if (closestConstructionSite) {
        this.room.memory.constructionSiteId = closestConstructionSite.id
        this.room.memory.constructionSiteType = closestConstructionSite.structureType
        this.room.memory.constructionSitePos = { x: closestConstructionSite.pos.x, y: closestConstructionSite.pos.y }
        return true
    } else return false
}

Creep.prototype.repairWall = function () {
    const needRepairWallId = this.room.memory.needRepairWallId
    if (!(Game.time % wallFocusTime) || !needRepairWallId) {
        const minHitsWall = [...this.room.wall, ...this.room.rampart].filter(i => i.hits < wallHitsMax).sort((a, b) => a.hits - b.hits)[0]
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

// simple behavior -------------------------------------------------------------------------------

Creep.prototype.getFrom = function (target, resourceType = RESOURCE_ENERGY, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target)
    return result
}

Creep.prototype.putTo = function (target, resourceType = RESOURCE_ENERGY, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target)
    return result
}

Creep.prototype.buildTo = function (constructionSite) {
    const result = this.build(constructionSite)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(constructionSite)
    return result
}

Creep.prototype.dismantleTo = function (structure) {
    const result = this.dismantle(structure)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(structure)
    return result
}

Creep.prototype.repairTo = function (structure) {
    const result = this.repair(structure)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(structure)
    return result
}

Creep.prototype.upgrade = function (controller) {
    if (!controller) controller = this.room.controller
    const result = this.upgradeController(controller)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(controller, { range: 3 })
}

Creep.prototype.claim = function (controller) {
    if (!controller) controller = this.room.controller
    const result = this.claimController(controller)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(controller)
}

Creep.prototype.reserve = function (controller) {
    if (!controller) controller = this.room.controller
    const result = this.reserveController(controller)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(controller)
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
