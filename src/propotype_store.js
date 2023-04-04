Object.defineProperty(Creep.prototype, 'energy', {
    get() {
        return this.store[energy]
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'freeCapacity', {
    get() {
        return this.store.getFreeCapacity()
    },
    configurable: true
})

Object.defineProperty(Creep.prototype, 'usedCapacity', {
    get() {
        return this.store.getUsedCapacity()
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

Object.defineProperty(Structure.prototype, 'energy', {
    get() {
        if (!this.store) return
        return this.store[energy]
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'freeCapacity', {
    get() {
        if (!this.store) return
        if (this.structureType === STRUCTURE_LAB) return this.mineralType ? this.store.getFreeCapacity(this.mineralType) : LAB_MINERAL_CAPACITY
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getFreeCapacity(energy)
        return this.store.getFreeCapacity()
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'usedCapacity', {
    get() {
        if (!this.store) return
        if (this.structureType === STRUCTURE_LAB) return this.mineralType ? this.store.getUsedCapacity(this.mineralType) : 0
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getUsedCapacity(energy)
        return this.store.getUsedCapacity()
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isEmpty', {
    get() {
        if (!this.store) return
        if (this.structureType === STRUCTURE_LAB) return !this.mineralType
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store[energy] <= 0
        return this.store.getUsedCapacity() <= 0
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isFull', {
    get() {
        if (!this.store) return
        if (this.structureType === STRUCTURE_LAB) return this.mineralType ? this.store.getFreeCapacity(this.mineralType) <= 0 : false
        if (this.structureType === STRUCTURE_EXTENSION
            || this.structureType === STRUCTURE_LINK
            || this.structureType === STRUCTURE_NUKER
            || this.structureType === STRUCTURE_SPAWN
            || this.structureType === STRUCTURE_TOWER) return this.store.getFreeCapacity(energy) <= 0
        return this.store.getFreeCapacity() <= 0
    },
    configurable: true
})
