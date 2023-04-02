const isNeed = (creepMemory) => {
    //
}

const prepare = (creep) => creep.gotoFlagRoom(creep.memory.config.flagName)

const target = (creep) => {
    // remoteLock
}

const bodys = [
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 1 ],
    [ [MOVE, CLAIM], 2 ],
    [ [MOVE, CLAIM], 2 ],
    [ [MOVE, CLAIM], 3 ],
    [ [MOVE, CLAIM], 3 ],
    [ [MOVE, CLAIM], 3 ]
]

module.exports = { isNeed, prepare, target, bodys }
