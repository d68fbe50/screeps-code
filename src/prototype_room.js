const { LAYOUT_DATA } = require('./config_layout')

Room.prototype.log = function (content, type, notifyNow, prefix) {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]</a>${prefix ? prefix : ''}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.cbo = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_BUY, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.cso = function (price, totalAmount, resourceType = RESOURCE_ENERGY) {
    return Game.market.createOrder({ type: ORDER_SELL, price, totalAmount, resourceType, roomName: this.name})
}

Room.prototype.getAvailableEnergyStructureId = function () {
    if (this.storage && this.storage.energy > 10000) return this.storage
    if (this.terminal && this.terminal.energy > 10000) return this.terminal
    const container = this.memory.sourceContainerList.map(s => Game.getObjectById(s)).filter(s => s && s.energy > 1000).sort((a, b) => b.energy - a.energy)[0]
    return container && container.id
}

Room.prototype.setCenterPos = function (centerPosX, centerPosY) {
    this.memory.centerPos.x = centerPosX
    this.memory.centerPos.y = centerPosY
    this.log(`房间中心点已设置为 [${centerPosX},${centerPosY}]`, 'success')
}

Room.prototype.visualLayout = function (centerPosX = 25, centerPosY = 25) {
    Object.keys(LAYOUT_DATA).forEach(l => {
        Object.keys(LAYOUT_DATA[l]).forEach(s => {
            LAYOUT_DATA[l][s].forEach(p => {
                this.visual.structure(p[0]-25+centerPosX, p[1]-25+centerPosY, s)
            })
        })
    })
    this.visual.connectRoads()
}

let tmpTick
Room.prototype.unclaimRoom = function (confirm) { // 防止 not defined 错误
    if (!confirm) return false
    if (tmpTick !== Game.time - 1) {
        tmpTick = Game.time
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        log('危险操作！！！请在 1 tick 内再次调用以移除！！！', 'error')
        return
    }
    // TODO
    this.controller.unclaim()
    log(`room: ${this.name} 已移除！`, 'error')
    log(`room: ${this.name} 已移除！`, 'error')
    log(`room: ${this.name} 已移除！`, 'error')
}

// Room Properties -------------------------------------------------------------------------------

Object.defineProperty(Room.prototype, 'my', {
    get() {
        return this.controller && this.controller.my
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'level', {
    get() {
        return this.controller && this.controller.level
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'owner', {
    get() {
        return this.controller && this.controller.owner ? this.controller.owner.username : undefined
    },
    configurable: true
})

// Structure Properties --------------------------------------------------------------------------

Object.defineProperty(Room.prototype, 'structures', {
    get() {
        if (!this._allStructures) this._allStructures = this.find(FIND_STRUCTURES)
        return this._allStructures
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'hostileStructures', {
    get() {
        if (!this._hostileStructures) this._hostileStructures = this.find(FIND_HOSTILE_STRUCTURES, { filter: s => s.hitsMax })
        return this._hostileStructures
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'centerLink', {
    get() {
        return this.memory.centerLinkId && Game.getObjectById(this.memory.centerLinkId)
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

// Creep Properties ------------------------------------------------------------------------------

Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) this._creeps = this.find(FIND_MY_CREEPS)
        return this._creeps
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
        if (!this._invaders) this._invaders = _.filter(this.hostiles, c => c.owner.username === 'Invader')
        return this._invaders
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'sourceKeepers', {
    get() {
        if (!this._sourceKeepers) this._sourceKeepers = _.filter(this.hostiles, c => c.owner.username === 'Source Keeper')
        return this._sourceKeepers
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'playerHostiles', {
    get() {
        if (!this._playerHostiles) {
            this._playerHostiles = _.filter(this.hostiles, c => c.owner.username !== 'Invader' && c.owner.username !== 'Source Keeper')
        }
        return this._playerHostiles
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

// Other Properties ------------------------------------------------------------------------------

Object.defineProperty(Room.prototype, 'flags', {
    get() {
        if (!this._flags) this._flags = this.find(FIND_FLAGS)
        return this._flags
    },
    configurable: true
})

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

Object.defineProperty(Room.prototype, 'drops', {
    get() {
        if (!this._drops) this._drops = _.groupBy(this.find(FIND_DROPPED_RESOURCES), r => r.resourceType)
        return this._drops;
    },
    configurable: true
})

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
