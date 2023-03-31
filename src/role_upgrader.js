const isNeed = function (creepMemory) {
    //
}

const boostPrepare = function (creep) {
    //
}

const prepare = function (creep) {
    //
}

const target = function (creep) {
    //
}

const bodys = [
    [ [MOVE, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 1, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 2, [CARRY], 1 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 3, [CARRY], 2 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 4, [CARRY], 2 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 9, [CARRY], 4 ],
    [ [MOVE, WORK, WORK, WORK, WORK], 4, [CARRY], 2 ]
]

module.exports = { isNeed, boostPrepare, prepare, target, bodys }
