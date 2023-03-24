const { wallHitsMax } = require('./config')

const roleRequires = { // 注意与 config.js 的 ROLE_TYPES 保持一致
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
    if (this.store.getUsedCapacity() === 0 || this.store.getUsedCapacity() === this.store[excludeResourceType]) return true
    const resourceType = Object.keys(this.store).find(i => i !== excludeResourceType && this.store[i] > 0)
    const putTarget = this.room.terminal ? this.room.terminal : this.room.storage
    if (putTarget) this.putTo(putTarget, resourceType)
    else this.drop(resourceType)
    return false
}

Creep.prototype.buildStructure = function () {
    const constructionSiteId = this.room.memory.constructionSiteId
    const constructionSite = Game.getObjectById(constructionSiteId)
    if (constructionSite) {
        this.buildTo(constructionSite)
        return true
    }
    if (constructionSiteId) { // !constructionSite
        delete this.room.memory.constructionSiteId
        this.room.update() // wheel.structureCache.js
        return true
    }
    const closestConstructionSite = this.pos.findClosestByRange(this.room.constructionSites)
    if (closestConstructionSite) { // !constructionSite && !constructionSiteId
        this.room.memory.constructionSiteId = closestConstructionSite.id
        return true
    } else return false
}

Creep.prototype.repairWall = function () {
    const needRepairWallId = this.room.memory.needRepairWallId
    if (!(Game.time % 100) || !needRepairWallId) {
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

Creep.prototype.getFrom = function (target, resourceType = RESOURCE_ENERGY, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target, { range: 1 })
    return result
}

Creep.prototype.putTo = function (target, resourceType = RESOURCE_ENERGY, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target, { range: 1 })
    return result
}

Creep.prototype.buildTo = function (constructionSite) {
    const result = this.build(constructionSite)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(constructionSite, { range: 3 })
    return result
}

Creep.prototype.dismantleTo = function (structure) {
    const result = this.dismantle(structure)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(structure, { range: 1 })
    return result
}

Creep.prototype.repairTo = function (structure) {
    const result = this.repair(structure)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(structure, { range: 3 })
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
    if (result === ERR_NOT_IN_RANGE) this.moveTo(controller, { range: 1 })
}

Creep.prototype.reserve = function (controller) {
    if (!controller) controller = this.room.controller
    const result = this.reserveController(controller)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(controller, { range: 1 })
}

module.exports = { roleRequires }
