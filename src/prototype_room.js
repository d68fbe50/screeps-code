Room.prototype.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]&nbsp;</a>${prefix}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.checkRoomMemory = function () {
    if (!this.memory.centerPos) this.memory.centerPos = {}
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

Object.defineProperty(Room.prototype, 'flags', {
    get() {
        if (!this._flags) this._flags = this.find(FIND_FLAGS)
        return this._flags
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

// =================================================================================================== Controller

Object.defineProperty(Room.prototype, 'level', {
    get() {
        return this.controller && this.controller.level
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'my', {
    get() {
        return this.controller && this.controller.my
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'owner', {
    get() {
        return this.controller && this.controller.owner ? this.controller.owner.username : undefined
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

// =================================================================================================== Layout

global.visualLayout = function (roomName, centerPosX = 25, centerPosY = 25) {
    const visual = new RoomVisual(roomName)
    Object.keys(LAYOUT_DATA).forEach(level => {
        Object.keys(LAYOUT_DATA[level]).forEach(type => {
            LAYOUT_DATA[level][type].forEach(posXY => {
                visual.structure(posXY[0]-25+centerPosX, posXY[1]-25+centerPosY, type)
            })
        })
    })
    visual.connectRoads()
}

Room.prototype.setCenterPos = function (centerPosX, centerPosY) {
    this.memory.centerPos.x = centerPosX
    this.memory.centerPos.y = centerPosY
    this.log(`房间中心点已设置为 [${centerPosX},${centerPosY}]`)
}

Room.prototype.structRoadPath = function (fromPos, toPos, cut = 2) {
    let result = false
    this.visualRoadPath(fromPos, toPos, cut).forEach(i => this.createConstructionSite(i.x, i.y, STRUCTURE_ROAD) === OK && (result = true))
    return result
}

Room.prototype.updateLayout = function () {
    if (!this.memory.isAutoLayout || !this.centerPos) return this.log('自动布局未开启或中心点未设置', 'warning')
    let needBuild = false
    Object.keys(LAYOUT_DATA).forEach(level => {
        level <= this.level && Object.keys(LAYOUT_DATA[level]).forEach(type => {
            LAYOUT_DATA[level][type].forEach(posXY => {
                const pos = new RoomPosition(posXY[0]-25+this.centerPos.x, posXY[1]-25+this.centerPos.y, this.name)
                const result = pos.createConstructionSite(type)
                if (result) needBuild = true
            })
        })
    })
    if (this.level >= 1) {
        this.source.forEach(i => this.structRoadPath(i.pos, this.controller.pos, 4) && (needBuild = true))
    }
    if (this.level >= 3) {
        this.source.forEach(i => this.structRoadPath(i.pos, this.centerPos, 5) && (needBuild = true))
    }
    if (this.level >= 4) {
        this.structRoadPath(this.controller.pos, this.centerPos, 5) && (needBuild = true)
    }
    if (needBuild) this.addWorkTask('build')
}

Room.prototype.visualRoadPath = function (fromPos, toPos, cut = 2) {
    let paths = this.findPath(fromPos, toPos, {
        ignoreCreeps: true,
        ignoreDestructibleStructures: true,
        ignoreRoads: true
    })
    paths.shift()
    paths = _.dropRight(paths, cut)
    paths = paths.map(i => new RoomPosition(i.x, i.y, this.name))
    this.visual.poly(paths)
    return paths
}

Object.defineProperty(Room.prototype, 'centerPos', {
    get() {
        if (!this.memory.centerPos) this.memory.centerPos = {}
        if (this.memory.centerPos.x && this.memory.centerPos.y) return new RoomPosition(this.memory.centerPos.x, this.memory.centerPos.y, this.name)
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
        return this._drops;
    },
    configurable: true
})

// =================================================================================================== Structure

Object.defineProperty(Room.prototype, 'centerLink', {
    get() {
        return this.memory.centerLinkId && Game.getObjectById(this.memory.centerLinkId)
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

Object.defineProperty(Room.prototype, 'sourceContainers', {
    get() {
        if (!this.memory.sourceContainerIds) this.memory.sourceContainerIds = []
        return this.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => !!i)
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

Object.defineProperty(Room.prototype, 'upgradeContainer', {
    get() {
        return Game.getObjectById(this.memory.upgradeContainerId)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'upgradeLink', {
    get() {
        return this.memory.upgradeLinkId && Game.getObjectById(this.memory.upgradeLinkId)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'wall', {
    get() {
        return this[STRUCTURE_WALL]
    },
    configurable: true
})

const LAYOUT_DATA = {
    1: {
        spawn: [ [25,22] ]
    },
    2: {
        extension: [ [22,23], [23,22], [23,23], [23,24], [24,23] ]
    },
    3: {
        tower: [ [21,24] ],
        extension: [ [26,23], [27,22], [27,23], [27,24], [28,23] ],
        road: [
            [21,23], [21,27], [22,22], [22,24], [22,26], [22,28], [23,21], [23,25], [23,29], [24,22],
            [24,24], [24,26], [24,28], [25,23], [25,27], [26,22], [26,24], [26,26], [26,28], [27,21],
            [27,25], [27,29], [28,22], [28,24], [28,26], [28,28], [29,23], [29,27]
        ]
    },
    4: {
        extension: [ [22,27], [23,26], [23,27], [23,28], [24,27], [26,27], [27,26], [27,27], [27,28], [28,27] ],
        storage: [ [25,26] ]
    },
    5: {
        tower: [ [29,24] ],
        extension: [ [21,21], [22,21], [24,21], [25,21], [26,21], [28,21], [29,21], [21,22], [29,22], [21,25] ],
        link: [ [25,24] ]
    },
    6: {
        extension: [ [22,25], [28,25], [29,25], [21,28], [25,28], [29,28], [21,29], [25,29], [29,29] ],
        terminal: [ [26,25] ]
    },
    7: {
        tower: [ [21,26] ],
        spawn: [ [22,29] ]
    },
    8: {
        tower: [ [29,26], [24,29], [26,29] ],
        spawn: [ [28,29] ],
        powerSpawn: [ [24,25] ]
    }
}

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
