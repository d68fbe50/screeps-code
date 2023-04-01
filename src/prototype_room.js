Room.prototype.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]&nbsp;</a>${prefix}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.checkRoomMemory = function () {
    if (!this.memory.centerPos) this.memory.centerPos = {}
    if (!this.memory.labs) this.memory.labs = {}
    if (!this.memory.roomStatus) this.memory.roomStatus = 'Normal'
    if (!this.memory.sourceContainerIds) this.memory.sourceContainerIds = []
    if (!this.memory.TaskCenter) this.memory.TaskCenter = []
    if (!this.memory.TaskRemote) this.memory.TaskRemote = []
    if (!this.memory.TaskSpawn) this.memory.TaskSpawn = []
    if (!this.memory.TaskTransport) this.memory.TaskTransport = []
    if (!this.memory.TaskWork) this.memory.TaskWork = []
    if (!this.memory.remoteLocks) this.memory.remoteLocks = {}
}

Room.prototype.roomVisual = function () {
    let visualTextY = 20

    this.visual.text(`RoomStatus: ${this.memory.roomStatus}`, 1, visualTextY++, { align: 'left' })

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
    if (this.storage && this.storage.energy > (ignoreLimit ? 1000 : 10000)) return [this.storage]
    if (this.terminal && this.terminal.energy > (ignoreLimit ? 1000 : 10000)) return [this.terminal]
    const containers = this.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => i && i.energy > (ignoreLimit ? 100 : 500))
    if (containers.length > 0) return containers
    if (!includeSource) return []
    return this.source.filter(i => i.energy > (ignoreLimit ? 100 : 500) && i.pos.availableNeighbors().length > 0)
}

Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES)
        return this._constructionSites
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) this._creeps = this.find(FIND_MY_CREEPS)
        return this._creeps
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
