const mount_role = require('./roles')

Creep.prototype.log = function (content, type = 'info', notifyNow = false) {
    this.say(content)
    this.room.log(content, type, notifyNow, `[${this.memory.role}:${this.name},${this.pos.x},${this.pos.y}]&nbsp;`)
}

Creep.prototype.run = function () {
    if (this.spawning) return

    const roleRequire = mount_role[this.memory.role].require
    if (!roleRequire) return this.say('no role!')
    if (!this.home) return this.say('no home!')

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

// =================================================================================================== Base

Creep.prototype.attackC = function (target) {
    if (!target) target = this.room.controller
    const result = this.attackController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.buildTo = function (target) {
    const result = this.build(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target) || this.repairRoad()
    return result
}

Creep.prototype.claim = function (target) {
    if (!target) target = this.room.controller
    const result = this.claimController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.dismantleTo = function (target) {
    const result = this.dismantle(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.getFrom = function (target, resourceType = RESOURCE_ENERGY, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.goto = function (firstArg, secondArg, opts) {
    if (Memory.isVisualPath) {
        const toPos = (typeof firstArg == 'object') ? (firstArg.pos || firstArg) : new RoomPosition(firstArg, secondArg, this.room.name)
        this.room.visual.line(this.pos, toPos, { width: 0.05 })
    }
    this.moveTo(firstArg, secondArg, opts)
}

Creep.prototype.putTo = function (target, resourceType = RESOURCE_ENERGY, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.repairTo = function (target) {
    const result = this.repair(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target) || this.repairRoad()
    return result
}

Creep.prototype.reserve = function (target) {
    if (!target) target = this.room.controller
    const result = this.reserveController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.upgrade = function (target) {
    if (!target) target = this.room.controller
    const result = this.upgradeController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target, {range: 3}) || this.repairRoad()
    return result
}

Object.defineProperty(Creep.prototype, 'home', {
    get() {
        const home = Game.rooms[this.memory.home]
        if (home) return home
        this.say('no home!')
    },
    configurable: true
})

// =================================================================================================== Boost

Object.defineProperty(Creep.prototype, 'boostCounts', {
    get() {
        if (!this._boostCounts) {
            this._boostCounts = _.countBy(this.body, i => i.boost)
        }
        return this._boostCounts
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'boosts', {
    get() {
        if (!this._boosts) {
            this._boosts = _.compact(_.unique(_.map(this.body, i => i.boost)))
        }
        return this._boosts
    },
    configurable: true
})

// =================================================================================================== Senior

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

Creep.prototype.clearResources = function (excludeResourceType) { // 置空抛所有
    if (this.isEmpty || this.store.getUsedCapacity() === this.store[excludeResourceType]) return true
    const resourceType = Object.keys(this.store).find(i => i !== excludeResourceType && this.store[i] > 0)
    const putTarget = this.room.terminal ? this.room.terminal : this.room.storage
    if (putTarget) this.putTo(putTarget, resourceType)
    else this.drop(resourceType)
    return false
}

Creep.prototype.fillExtensions = function () {
    if (this.room.energyAvailable === this.room.energyCapacityAvailable) {
        delete this.memory.needFillExtensionId
        return false
    }
    let target = Game.getObjectById(this.memory.needFillExtensionId)
    if (!target) {
        target = this.pos.findClosestByRange([...this.room.spawn, ...this.room.extension], { filter: i => !i.isFull })
        if (target) this.memory.needFillExtensionId = target.id // target 一定存在
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.needFillExtensionId
    return true
}

Creep.prototype.fillTowers = function () {
    let target = Game.getObjectById(this.memory.needFillTowerId)
    if (!target) {
        target = this.pos.findClosestByRange(this.room.tower, { filter: i => i.energy < i.capacity / 2 })
        if (target) this.memory.needFillTowerId = target.id
        else {
            delete this.memory.needFillTowerId
            return false
        }
    }
    const result = this.putTo(target)
    if (result !== ERR_NOT_IN_RANGE) delete this.memory.needFillTowerId
    return true
}

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
        if (energySource instanceof Source) this.memory.dontPullMe = true // 采矿时禁止对穿
    }
    else if (result !== ERR_NOT_IN_RANGE) delete this.memory.energySourceId
    return false
}

Creep.prototype.goBackHome = function () {
    if (this.room.name === this.memory.home) return true
    this.goto(this.home.centerPos || this.home.controller)
}

Creep.prototype.gotoFlag = function (flagName, range = 1) {
    const flag = Game.flags[flagName]
    if (!flag) {
        this.say('no flag!')
        return false
    }
    if (this.pos.inRangeTo(flag.pos, range)) return true
    this.goto(flag)
}

Creep.prototype.gotoFlagRoom = function (flagName) {
    const flag = Game.flags[flagName]
    if (!flag) {
        this.say('no flag!')
        return false
    }
    if (this.room.name === flag.pos.roomName) return true
    this.goto(flag)
}

Creep.prototype.repairRoad = function () {
    if (this.room.my && this.room.tower.length > 0) return false
    const road = this.pos.lookForStructure(STRUCTURE_ROAD)
    if (road && road.hits < road.hitsMax / 2) return this.repair(road)
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

// =================================================================================================== Store

Object.defineProperty(Creep.prototype, 'capacity', {
    get() {
        return this.store.getCapacity()
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'energy', {
    get() {
        return this.store[RESOURCE_ENERGY]
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'inRampart', {
    get() {
        return !!this.pos.lookForStructure(STRUCTURE_RAMPART)
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
