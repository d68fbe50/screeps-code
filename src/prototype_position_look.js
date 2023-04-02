Object.defineProperty(RoomPosition.prototype, 'creep', {
    get() {
        return this.lookFor(LOOK_CREEPS)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'drops', {
    get() {
        return this.lookFor(LOOK_RESOURCES)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'source', {
    get() {
        return this.lookFor(LOOK_SOURCES)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'mineral', {
    get() {
        return this.lookFor(LOOK_MINERALS)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'deposit', {
    get() {
        return this.lookFor(LOOK_DEPOSITS)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'structures', {
    get() {
        return this.lookFor(LOOK_STRUCTURES)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'flags', {
    get() {
        return this.lookFor(LOOK_FLAGS)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'constructionSite', {
    get() {
        return this.lookFor(LOOK_CONSTRUCTION_SITES)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'nukes', {
    get() {
        return this.lookFor(LOOK_NUKES)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'terrain', {
    get() {
        return this.lookFor(LOOK_TERRAIN)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'tombstones', {
    get() {
        return this.lookFor(LOOK_TOMBSTONES)
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'powerCreep', {
    get() {
        return this.lookFor(LOOK_POWER_CREEPS)[0]
    },
    configurable: true
})

Object.defineProperty(RoomPosition.prototype, 'ruins', {
    get() {
        return this.lookFor(LOOK_RUINS)
    },
    configurable: true
})
