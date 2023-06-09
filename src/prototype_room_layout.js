global.visualLayout = function (roomName, pos) {
    const visual = new RoomVisual(roomName)
    _.keys(newLayoutData).forEach(level => {
        _.keys(newLayoutData[level]).forEach(type => {
            newLayoutData[level][type].forEach(xy => {
                visual.structure(xy[0] + pos.x, xy[1] + pos.y, type)
            })
        })
    })
    visual.connectRoads()
}

Room.prototype.setCenterPos = function (pos) {
    if (!this.memory.centerPos) this.memory.centerPos = {}
    this.memory.centerPos.x = pos.x
    this.memory.centerPos.y = pos.y
    this.log(`房间中心点已设置为 [${pos.x},${pos.y}]`)
}

Room.prototype.structRoadPath = function (fromPos, toPos, cut = 2) {
    let result = false
    this.visualRoadPath(fromPos, toPos, cut).forEach(i => this.createConstructionSite(i.x, i.y, STRUCTURE_ROAD) === OK && (result = true))
    return result
}

Room.prototype.updateLayout = function () {
    if (!this.memory.isAutoLayout || !this.centerPos) return this.log('自动布局未开启或中心点未设置', 'warning')
    _.keys(newLayoutData).forEach(level => {
        level <= this.level && _.keys(newLayoutData[level]).forEach(type => {
            newLayoutData[level][type].forEach(posXY => {
                const pos = new RoomPosition(posXY[0]-25+this.centerPos.x, posXY[1]-25+this.centerPos.y, this.name)
                pos.terrain != 'wall' && pos.createConstructionSite(type)
            })
        })
    })
    if (this.level >= 2) {
        this.source.forEach(i => this.structRoadPath(i.pos, this.controller.pos, 4))
    }
    if (this.level >= 3) {
        this.source.forEach(i => this.structRoadPath(i.pos, this.centerPos, 5))
    }
    if (this.level >= 4) {
        this.structRoadPath(this.controller.pos, this.centerPos, 5)
    }
}

Room.prototype.visualRoadPath = function (fromPos, toPos, cut = 2) {
    let paths = this.findPath(fromPos, toPos, {
        ignoreCreeps: true,
        ignoreDestructibleStructures: false,
        ignoreRoads: false,
        range: 0
    })
    paths.shift()
    paths = _.dropRight(paths, cut)
    paths = paths.map(i => new RoomPosition(i.x, i.y, this.name))
    this.visual.poly(paths)
    return paths
}

Object.defineProperty(Room.prototype, 'centerPos', {
    get() {
        if (!this.memory.centerPos) this.memory.centerPos = {}
        if (this.memory.centerPos.x && this.memory.centerPos.y) return new RoomPosition(this.memory.centerPos.x, this.memory.centerPos.y, this.name)
        else this.log('房间未设置中心点！', 'error')
    },
    configurable: true
})

const newLayoutData = {
    1: {
        spawn: [ [-2,-2] ]
    },
    2: {
        extension: [ [-3,-2], [-2,-3], [-4,-2], [-3,-3], [-2,-4] ]
    },
    3: {
        tower: [ [-1,-3] ],
        extension: [ [-4,-3], [-3,-4], [-4,2], [-3,3], [-2,4] ],
        road: [ [0,3], [-1,2], [-2,1], [-3,0], [-2,-1], [-1,-2], [0,-3], [3,0], [2,1], [1,2], [0,-2], [2,0], [1,-1], [-1,-4], [-4,-1], [-5,-2], [-2,-5], [-5,-3], [-4,-4], [-3,-5], [-4,1], [-5,2], [-1,4], [-2,5], [-5,3], [-4,4], [-3,5], [1,4], [2,5], [4,1], [3,5], [4,4], [5,3], [5,2], [1,-4], [2,-5], [3,-5], [4,-4], [5,-3], [5,-2], [4,-1], [3,-3], [2,-2] ]
    },
    4: {
        extension: [ [-3,2], [-2,3], [-4,3], [-3,4], [2,4], [3,3], [4,2], [3,2], [2,3], [3,4] ],
        storage: [ [1,0] ]
    },
    5: {
        tower: [ [-3,-1] ],
        extension: [ [4,3], [-1,-1], [-2,0], [-1,1], [0,2], [1,1], [-4,0], [-5,-1], [-5,0], [-5,1] ],
        link: [ [0,1] ]
    },
    6: {
        extension: [ [-4,-5], [-5,-5], [-5,-4], [-5,4], [-5,5], [-4,5], [-1,5], [0,5], [1,5], [0,4] ],
        lab: [ [2,-3], [3,-2], [1,-2] ],
        container: [ [2,-2] ],
        terminal: [ [0,-1] ]
    },
    7: {
        tower: [ [-3,1] ],
        spawn: [ [-2,2] ],
        extension: [ [4,5], [5,5], [5,4], [4,0], [5,1], [5,0], [5,-1], [5,-4], [5,-5], [4,-5] ],
        lab: [ [2,-1], [3,-1], [1,-3] ]
    },
    8: {
        tower: [ [-1,3], [1,3], [3,1] ],
        spawn: [ [2,2] ],
        extension: [ [-1,-5], [1,-5] ],
        lab: [ [2,-4], [3,-4], [4,-3], [4,-2] ],
        observer: [ [0,-5] ],
        powerSpawn: [ [-1,0] ],
        nuker: [ [0,-4] ]
    }
}
