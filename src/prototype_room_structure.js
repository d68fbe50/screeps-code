Object.defineProperty(Room.prototype, 'sourceContainers', {
    get() {
        if (!this.memory.sourceContainerIds) this.memory.sourceContainerIds = []
        return this.memory.sourceContainerIds.map(i => Game.getObjectById(i)).filter(i => !!i)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'labContainer', {
    get() {
        return Game.getObjectById(this.memory.labContainerId)
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'inLab1', {
    get() {
        if (!this._hasAccessInLab1) {
            this._hasAccessInLab1 = true
            this._inLab1 = this.lab.find(i => this.memory.labs[i.id] === 'inLab1')
        }
        return this._inLab1
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'inLab2', {
    get() {
        if (!this._hasAccessInLab2) {
            this._hasAccessInLab2 = true
            this._inLab2 = this.lab.find(i => this.memory.labs[i.id] === 'inLab2')
        }
        return this._inLab2
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'boostLabs', {
    get() {
        if (!this._hasAccessBoostLabs) {
            this._hasAccessBoostLabs = true
            this._boostLabs = this.lab.filter(i => this.memory.labs[i.id]
                && this.memory.labs[i.id] !== 'inLab1'
                && this.memory.labs[i.id] !== 'inLab2'
                && this.memory.labs[i.id] !== 'reaction')
        }
        return this._boostLabs
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'reactionLabs', {
    get() {
        if (!this._hasAccessReactionLabs) {
            this._hasAccessReactionLabs = true
            this._reactionLabs = this.lab.filter(i => this.memory.labs[i.id] === 'reaction')
        }
        return this._reactionLabs
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
