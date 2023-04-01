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
        if (!this._invaders) this._invaders = _.filter(this.hostiles, i => i.owner.username === 'Invader')
        return this._invaders
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

Object.defineProperty(Room.prototype, 'playerHostiles', {
    get() {
        if (!this._playerHostiles) {
            this._playerHostiles = _.filter(this.hostiles, i => i.owner.username !== 'Invader' && i.owner.username !== 'Source Keeper')
        }
        return this._playerHostiles
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'drops', {
    get() {
        if (!this._drops) this._drops = this.find(FIND_DROPPED_RESOURCES)
        return this._drops
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

Object.defineProperty(Room.prototype, 'hostileStructures', {
    get() {
        if (!this._hostileStructures) this._hostileStructures = this.find(FIND_HOSTILE_STRUCTURES, { filter: i => i.hitsMax })
        return this._hostileStructures
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

Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) this._constructionSites = this.find(FIND_MY_CONSTRUCTION_SITES)
        return this._constructionSites
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'hostileConstructionSites', {
    get() {
        if (!this._hostileConstructionSites) this._hostileConstructionSites = this.find(FIND_HOSTILE_CONSTRUCTION_SITES)
        return this._hostileConstructionSites
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'nukes', {
    get() {
        if (!this._nukes) this._nukes = this.find(FIND_NUKES)
        return this._nukes
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

Object.defineProperty(Room.prototype, 'ruins', {
    get() {
        if (!this._ruins) this._ruins = this.find(FIND_RUINS)
        return this._ruins
    },
    configurable: true
})
