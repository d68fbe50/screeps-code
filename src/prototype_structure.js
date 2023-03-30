Structure.prototype.log = function (content, type = 'info', notifyNow = false) {
    this.room.log(content, type, notifyNow, `[${this.structureType},${this.pos.x},${this.pos.y}]&nbsp;`)
}

// =================================================================================================== Base

Object.defineProperty(Structure.prototype, 'isWalkable', {
    get() {
        return this.structureType === STRUCTURE_ROAD
            || this.structureType === STRUCTURE_CONTAINER
            || (this.structureType === STRUCTURE_RAMPART && (this.my || this.isPublic))
    },
    configurable: true
})

// =================================================================================================== Store

Object.defineProperty(Structure.prototype, 'capacity', {
    get() {
        if (!this.store) {
            log('no-store！', 'error')
            return
        }
        if (this.structureType === STRUCTURE_LAB) return 3000
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getCapacity(RESOURCE_ENERGY)
        return this.store.getCapacity()
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'energy', {
    get() {
        if (!this.store) {
            log('no-store！', 'error')
            return
        }
        return this.store[RESOURCE_ENERGY]
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isEmpty', {
    get() {
        if (!this.store) {
            log('no-store！', 'error')
            return
        }
        if (this.structureType === STRUCTURE_LAB) return this.store[this.mineralType || 'X'] <= 0
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store[RESOURCE_ENERGY] <= 0
        return this.store.getUsedCapacity() <= 0
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isFull', {
    get() {
        if (!this.store) {
            log('no-store！', 'error')
            return
        }
        if (this.structureType === STRUCTURE_LAB) return this.store[this.mineralType || 'X'] >= 3000
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
        return this.store.getFreeCapacity() <= 0
    },
    configurable: true
})
