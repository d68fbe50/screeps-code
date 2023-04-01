const roles = require('./role')

Creep.prototype.log = function (content, type = 'info', notifyNow = false) {
    this.say(content)
    this.room.log(content, type, notifyNow, `[${this.memory.role}:${this.name},${this.pos.x},${this.pos.y}]&nbsp;`)
}

Creep.prototype.run = function () {
    if (!this.memory.config) this.memory.config = {}
    if (!this.memory.task) this.memory.task = {}

    if (this.spawning) return

    const roleConfig = roles[this.memory.role]
    if (!roleConfig) return this.say('no role!')
    const roleRequire = roleConfig.require
    if (!this.home) return this.say('no home!')

    if (!this.memory.boostReady) {
        if (roleRequire.boostPrepare) this.memory.boostReady = roleRequire.boostPrepare(this)
        else this.memory.boostReady = true
    }
    if (!this.memory.boostReady) return

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

Creep.prototype.clearCarry = function (excludeResourceType) {
    if (this.isEmpty || this.store.getUsedCapacity() === this.store[excludeResourceType]) return true
    const resourceType = Object.keys(this.store).find(i => i !== excludeResourceType && this.store[i] > 0)
    const putTarget = this.room.storage ? this.room.storage : this.room.terminal
    if (putTarget) this.putTo(putTarget, resourceType)
    else this.drop(resourceType)
    return false
}

Creep.prototype.dismantleTo = function (target) {
    const result = this.dismantle(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.getEnergy = function (ignoreLimit = false, includeSource = true, energyPercent = 1) {
    if (this.energy / this.store.getCapacity() >= energyPercent) {
        delete this.memory.energySourceId
        delete this.memory.dontPullMe
        return true
    }
    if (!this.clearCarry(RESOURCE_ENERGY)) return false
    if (!(Game.time % 10) && this.isEmpty) delete this.memory.energySourceId
    if (!this.memory.energySourceId) {
        const energySources = getEnergySources(this.room, ignoreLimit, includeSource)
        this.memory.energySourceId = energySources.length > 1 ? this.pos.findClosestByRange(energySources).id : (energySources[0] && energySources[0].id)
    }
    const energySource = Game.getObjectById(this.memory.energySourceId)
    if (!energySource) {
        delete this.memory.energySourceId
        return false
    }
    const result = this.getFrom(energySource)
    if (result === OK) {
        if (energySource instanceof Source) this.memory.dontPullMe = true
    }
    else if (result !== ERR_NOT_IN_RANGE) delete this.memory.energySourceId
    return false
}

Creep.prototype.getFrom = function (target, resourceType = RESOURCE_ENERGY, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.goBackHome = function () {
    if (this.room.name === this.memory.home) return true
    this.goto(this.home.centerPos || this.home.controller)
}

Creep.prototype.goto = function (firstArg, secondArg, opts) {
    if (Memory.isVisualPath) {
        const toPos = (typeof firstArg == 'object') ? (firstArg.pos || firstArg) : new RoomPosition(firstArg, secondArg, this.room.name)
        if (this.room.name === toPos.roomName) this.room.visual.line(this.pos, toPos, { width: 0.05 })
    }
    this.moveTo(firstArg, secondArg, opts)
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

Creep.prototype.putTo = function (target, resourceType = RESOURCE_ENERGY, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.repairRoad = function () {
    if (this.room.my && this.room.tower.length > 0) return false
    const road = this.pos.lookForStructure(STRUCTURE_ROAD)
    if (road && road.hits < road.hitsMax / 2) return this.repair(road)
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

function getEnergySources (room, ignoreLimit, includeSource) {
    if (room.memory.useRuinEnergy) {
        const ruins = room.find(FIND_RUINS).filter(i => i.store[RESOURCE_ENERGY] >= 1000)
        if (ruins.length > 0) return ruins
    }
    if (room.storage && room.storage.energy > (ignoreLimit ? 1000 : 10000)) return [room.storage]
    if (room.terminal && room.terminal.energy > (ignoreLimit ? 1000 : 10000)) return [room.terminal]
    const containers = room.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => i && i.energy > (ignoreLimit ? 100 : 500))
    if (containers.length > 0) return containers
    if (!includeSource) return []
    return room.source.filter(i => i.energy > (ignoreLimit ? 100 : 500) && i.pos.availableNeighbors().length > 0)
}
