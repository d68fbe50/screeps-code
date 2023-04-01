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
        if (this.structureType === STRUCTURE_LAB) return !this.mineralType
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
        if (this.structureType === STRUCTURE_LAB) return this.mineralType && this.store.getFreeCapacity(this.mineralType) <= 0
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
        return this.store.getFreeCapacity() <= 0
    },
    configurable: true
})
