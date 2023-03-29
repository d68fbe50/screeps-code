RoomPosition.prototype.availableNeighbors = function(ignoreCreeps = false) {
    return _.filter(this.neighbors, i => i.isWalkable(ignoreCreeps))
}

RoomPosition.prototype.isWalkable = function(ignoreCreeps = false) {
    if (Game.map.getRoomTerrain(this.roomName).get(this.x, this.y) === TERRAIN_MASK_WALL) return false
    if (this.isVisible) {
        if (ignoreCreeps === false && this.lookFor(LOOK_CREEPS).length > 0) return false
        if (_.filter(this.lookFor(LOOK_STRUCTURES), i => !i.isWalkable).length > 0) return false
    }
    return true
}

RoomPosition.prototype.lookForStructure = function(structureType) {
    return _.find(this.lookFor(LOOK_STRUCTURES), i => i.structureType === structureType)
}

Object.defineProperty(RoomPosition.prototype, 'isEdge', {
    get: function() {
        return this.x === 0 || this.x === 49 || this.y === 0 || this.y === 49
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'isVisible', {
    get: function() {
        return Game.rooms[this.roomName] !== undefined
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'neighbors', {
    get: function() {
        const adjPos = [];
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
    get: function() {
        return _.min([this.x, 49 - this.x, this.y, 49 - this.y])
    },
    configurable: true
})
