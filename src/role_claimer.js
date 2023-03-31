const isNeed = () => false

const prepare = (creep) => creep.gotoFlagRoom(creep.memory.config.flagName)

const target = function (creep) {
    const result = creep.claim()
    if (result === OK) {
        creep.home.addHelper(creep.memory.config.flagName)
        return creep.suicide()
    }
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
