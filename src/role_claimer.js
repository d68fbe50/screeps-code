const isNeed = () => false

const prepare = (creep) => creep.gotoFlagRoom(creep.memory.config.flagName)

const target = (creep) => {
    const result = creep.claim()
    if (result !== OK) return
    creep.home.addHelper(creep.memory.config.flagName)
    creep.suicide()
}

const bodys = [
    [ [MOVE], 1, [CLAIM], 1 ],
    [ [MOVE], 1, [CLAIM], 1 ],
    [ [MOVE], 3, [CLAIM], 1 ],
    [ [MOVE], 5, [CLAIM], 1 ],
    [ [MOVE], 5, [CLAIM], 1 ],
    [ [MOVE], 5, [CLAIM], 1 ],
    [ [MOVE], 5, [CLAIM], 1 ],
    [ [MOVE], 5, [CLAIM], 1 ]
]

module.exports = { isNeed, prepare, target, bodys }
