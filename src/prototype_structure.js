Structure.prototype.log = function (content, type, notifyNow) {
    this.room.log(content, type, notifyNow, `[${this.pos.x},${this.pos.y}] [${this.structureType}]`)
}

Object.defineProperty(Structure.prototype, 'isWalkable', {
    get() {
        return this.structureType === STRUCTURE_ROAD
            || this.structureType === STRUCTURE_CONTAINER
            || (this.structureType === STRUCTURE_RAMPART && (this.my || this.isPublic))
    },
    configurable: true,
})

Object.defineProperty(Structure.prototype, 'energy', {
    get() {
        if (!this.store) {
            console.log('ERROR: 无 store 建筑不要访问 energy 属性！')
            return undefined
        }
        return this.store[RESOURCE_ENERGY]
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isEmpty', {
    get() {
        if (!this.store || this.structureType === STRUCTURE_LAB || this.structureType === STRUCTURE_NUKER) {
            console.log('ERROR: 无 store 建筑和 lab, nuker 建筑不要访问 isEmpty 属性！')
            return undefined
        }
        if (this.structureType === STRUCTURE_EXTENSION || this.structureType === STRUCTURE_LINK || this.structureType === STRUCTURE_SPAWN) return this.store[RESOURCE_ENERGY] <= 0
        return this.store.getUsedCapacity() <= 0
    },
    configurable: true
})

Object.defineProperty(Structure.prototype, 'isFull', {
    get() {
        if (!this.store || this.structureType === STRUCTURE_LAB || this.structureType === STRUCTURE_NUKER) {
            console.log('ERROR: 无 store 建筑和 lab, nuker 存储建筑不要访问 isFull 属性！')
            return undefined
        }
        if (this.structureType === STRUCTURE_EXTENSION || this.structureType === STRUCTURE_LINK || this.structureType === STRUCTURE_SPAWN) return this.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
        return this.store.getFreeCapacity() <= 0
    },
    configurable: true
})
