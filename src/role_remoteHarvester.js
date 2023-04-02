const harvesterRequire = require('./role_harvester')

const isNeed = function (creepMemory) {
    //
}

const prepare = function (creep) {
    // remoteLock
    return harvesterRequire.prepare(creep)
}

const target = function (creep) {
    // remoteLock
    return harvesterRequire.target(creep)
}

const bodys = [
    [ [MOVE], 1, [WORK], 2, [CARRY], 1 ],
    [ [MOVE], 2, [WORK], 4, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ],
    [ [MOVE], 3, [WORK], 6, [CARRY], 1 ]
]

module.exports = { isNeed, prepare, target, bodys }
