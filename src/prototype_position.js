RoomPosition.prototype.availableNeighbors = function(ignoreCreeps = false) {
    return this.neighbors.filter(i => i.isWalkable(ignoreCreeps))
}

RoomPosition.prototype.findStructureInRange = function(structureType, range) {
    return this.findInRange(FIND_STRUCTURES, range).find(i => i.structureType === structureType)
}

RoomPosition.prototype.isWalkable = function(ignoreCreeps = false) {
    if (Game.map.getRoomTerrain(this.roomName).get(this.x, this.y) === TERRAIN_MASK_WALL) return false
    if (this.isVisible) {
        if (ignoreCreeps === false && this.creep) return false
        if (this.structures.filter(i => !i.isWalkable).length > 0) return false
    }
    return true
}

RoomPosition.prototype.lookForStructure = function(structureType) {
    return this.structures.find(i => i.structureType === structureType)
}

Object.defineProperty(RoomPosition.prototype, 'isEdge', {
    get: function() {
        return this.x === 0 || this.x === 49 || this.y === 0 || this.y === 49
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'isVisible', {
    get() {
        return Game.rooms[this.roomName] !== undefined
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'neighbors', {
    get() {
        const adjPos = []
        for (const dx of [-1, 0, 1]) {
            for (const dy of [-1, 0, 1]) {
                if (!(dx === 0 && dy === 0)) {
                    const x = this.x + dx
                    const y = this.y + dy
                    if (0 < x && x < 49 && 0 < y && y < 49) adjPos.push(new RoomPosition(x, y, this.roomName))
                }
            }
        }
        return adjPos
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'rangeToEdge', {
    get() {
        return _.min([this.x, 49 - this.x, this.y, 49 - this.y])
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'room', {
    get() {
        return Game.rooms[this.roomName]
    },
    configurable: true
})
