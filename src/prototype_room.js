Room.prototype.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]&nbsp;</a>${prefix}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.checkRoomMemory = function () {
    if (!this.memory.centerPos) this.memory.centerPos = {}
    if (!this.memory.labs) this.memory.labs = {}
    if (!this.memory.sourceContainerIds) this.memory.sourceContainerIds = []
    if (!this.memory.TaskCenter) this.memory.TaskCenter = []
    if (!this.memory.TaskRemote) this.memory.TaskRemote = []
    if (!this.memory.TaskSpawn) this.memory.TaskSpawn = []
    if (!this.memory.TaskTransport) this.memory.TaskTransport = []
    if (!this.memory.TaskWork) this.memory.TaskWork = []
    if (!this.memory.remoteLocks) this.memory.remoteLocks = {}
}

Room.prototype.roomVisual = function () {
    let visualTextY = 25
    this.visual.text(`Transporter: ${this.memory.transporterAmount}, Worker: ${this.memory.workerAmount}, Upgrader: ${this.memory.upgraderAmount}`, 1, visualTextY++, { align: 'left' })

    let text = 'TaskCenter : ' + this.memory['TaskCenter'].map(i => `[${i.data.source}->${i.data.target}:${i.data.resourceType}*${i.data.amount}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskRemote : ' + this.memory['TaskRemote'].map(i => `[${i.data.sourceType}:${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskSpawn : ' + this.memory['TaskSpawn'].map(i => `[${i.data.role}:${i.key}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskTransport : ' + this.memory['TaskTransport'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskWork : ' + this.memory['TaskWork'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })
}

Room.prototype.collectRoomStats = function () {
    Memory.stats[this.name + '-rcl'] = this.controller.level
    Memory.stats[this.name + '-rclPercent'] = (this.controller.progress / (this.controller.progressTotal || 1)) * 100
    Memory.stats[this.name + '-energy'] = this[RESOURCE_ENERGY]
}

Room.prototype.getEnergySources = function (ignoreLimit, includeSource) {
    if (this.memory.useRuinEnergy) {
        const ruins = this.find(FIND_RUINS).filter(i => i.store[RESOURCE_ENERGY] >= 1000)
        if (ruins.length > 0) return ruins
    }
    if (this.storage && this.storage.energy > (ignoreLimit ? 0 : 10000)) return [this.storage]
    if (this.terminal && this.terminal.energy > (ignoreLimit ? 0 : 10000)) return [this.terminal]
    const containers = this.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => i && i.energy > (ignoreLimit ? 0 : 500))
    if (containers.length > 0) return containers
    if (!includeSource) return []
    return this.source.filter(i => i.energy > (ignoreLimit ? 0 : 500) && i.pos.availableNeighbors().length > 0)
}

// =================================================================================================== Base

Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES)
        return this._constructionSites
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'tombstones', {
    get() {
        if (!this._tombstones) this._tombstones = this.find(FIND_TOMBSTONES)
        return this._tombstones
    },
    configurable: true
})

// =================================================================================================== Creep

Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) this._creeps = this.find(FIND_MY_CREEPS)
        return this._creeps
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'dangerousHostiles', {
    get() {
        if (!this._dangerousHostiles) {
            if (this.my) this._dangerousHostiles = _.filter(this.hostiles,
                i => i.getActiveBodyparts(ATTACK) > 0 || i.getActiveBodyparts(WORK) > 0 || i.getActiveBodyparts(RANGED_ATTACK) > 0 || i.getActiveBodyparts(HEAL) > 0)
            else this._dangerousHostiles = _.filter(this.hostiles,
                i => i.getActiveBodyparts(ATTACK) > 0 || i.getActiveBodyparts(RANGED_ATTACK) > 0 || i.getActiveBodyparts(HEAL) > 0)
        }
        return this._dangerousHostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'dangerousPlayerHostiles', {
    get() {
        if (!this._dangerousPlayerHostiles) this._dangerousPlayerHostiles = _.filter(this.playerHostiles,
            i => i.getActiveBodyparts(ATTACK) > 0 || i.getActiveBodyparts(WORK) > 0 || i.getActiveBodyparts(RANGED_ATTACK) > 0 || i.getActiveBodyparts(HEAL) > 0)
        return this._dangerousPlayerHostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'hostiles', {
    get() {
        if (!this._hostiles) this._hostiles = this.find(FIND_HOSTILE_CREEPS)
        return this._hostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'invaders', {
    get() {
        if (!this._invaders) this._invaders = _.filter(this.hostiles, i => i.owner.username === 'Invader')
        return this._invaders
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'playerHostiles', {
    get() {
        if (!this._playerHostiles) {
            this._playerHostiles = _.filter(this.hostiles, i => i.owner.username !== 'Invader' && i.owner.username !== 'Source Keeper')
        }
        return this._playerHostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'sourceKeepers', {
    get() {
        if (!this._sourceKeepers) this._sourceKeepers = _.filter(this.hostiles, i => i.owner.username === 'Source Keeper')
        return this._sourceKeepers
    },
    configurable: true
})

// =================================================================================================== Market

Room.prototype.cob = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_BUY, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.cos = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_SELL, price, totalAmount, resourceType, roomName: this.name})
}

// =================================================================================================== Resources

Object.defineProperty(Room.prototype, 'droppedEnergy', {
    get() {
        return this.drops[RESOURCE_ENERGY] || []
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'droppedPower', {
    get() {
        return this.drops[RESOURCE_POWER] || []
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'drops', {
    get() {
        if (!this._drops) this._drops = _.groupBy(this.find(FIND_DROPPED_RESOURCES), i => i.resourceType)
        return this._drops
    },
    configurable: true
})

// =================================================================================================== Structure

Object.defineProperty(Room.prototype, 'hostileStructures', {
    get() {
        if (!this._hostileStructures) this._hostileStructures = this.find(FIND_HOSTILE_STRUCTURES, { filter: i => i.hitsMax })
        return this._hostileStructures
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'structures', {
    get() {
        if (!this._allStructures) this._allStructures = this.find(FIND_STRUCTURES)
        return this._allStructures
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'wall', {
    get() {
        return this[STRUCTURE_WALL]
    },
    configurable: true
})

let confirmTick
Room.prototype.unclaimRoom = function (confirm) { // 防止 not defined 错误
    if (!confirm) return false
    if (confirmTick !== Game.time - 1) {
        confirmTick = Game.time
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'warning')
        return
    }
    this.controller.unclaim()
    log(`room: ${this.name} 已移除！`, 'warning')
}
