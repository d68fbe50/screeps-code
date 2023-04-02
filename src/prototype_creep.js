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

    const working = roleRequire.source ? this.memory.working : true
    if (working) roleRequire.target && roleRequire.target(this) && (this.memory.working = !this.memory.working)
    else roleRequire.source && roleRequire.source(this) && (this.memory.working = !this.memory.working)
}

Creep.prototype.boost = function () {
    //
}

Creep.prototype.unboost = function () {
    if (!this.room.labContainer) return false
    const lab = this.room.labContainer.pos.findStructuresInRange(STRUCTURE_LAB, 1).find(i => i.cooldown === 0)
    if (!lab) return false
    if (!this.isEmpty) this.drop(RESOURCE_ENERGY)
    if (this.pos.isEqualTo(this.room.labContainer)) {
        lab.unboostCreep(this)
        return true
    }
    this.goto(this.room.labContainer)
    return ERR_NOT_IN_RANGE
}

Creep.prototype.clearCarry = function (excludeResourceType) {
    if (this.isEmpty || this.store.getUsedCapacity() === this.store[excludeResourceType]) return true
    const resourceType = Object.keys(this.store).find(i => i !== excludeResourceType && this.store[i] > 0)
    const putTarget = this.room.storage ? this.room.storage : this.room.terminal
    if (putTarget) this.putTo(putTarget, resourceType)
    else this.drop(resourceType)
    return false
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

Creep.prototype.receiveTask = function (type) {
    const task = this.room.getExpectTask(type)
    if (task) {
        this.memory.task = _.cloneDeep(task)
        this.room.updateTaskUnit(type, task.key, 1)
    }
    return task
}

Creep.prototype.revertTask = function (type) {
    this.room.updateTaskUnit(type, this.memory.task.key, -1)
    this.memory.task = {}
    return true
}

Creep.prototype.repairRoad = function () {
    if (this.room.my && this.room.tower.length > 0) return false
    const road = this.pos.lookForStructure(STRUCTURE_ROAD)
    if (road && road.hits < road.hitsMax / 2) return this.repair(road)
}

Object.defineProperty(Creep.prototype, 'bodyCounts', {
    get() {
        if (this.my && !this.memory.bodyCounts) this.memory.bodyCounts = _.countBy(this.body, i => i.type)
        return this.my ? this.memory.bodyCounts : _.countBy(this.body, i => i.type)
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'boostCounts', {
    get() {
        if (this.my && !this.memory.boostCounts) this.memory.boostCounts = _.countBy(this.body, i => i.boost)
        return this.my ? this.memory.boostCounts : _.countBy(this.body, i => i.boost)
    },
    configurable: true
})

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
