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
    [ [CARRY], 1, [MOVE, WORK, WORK], 1 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 2 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ],
    [ [CARRY], 1, [MOVE, WORK, WORK], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
