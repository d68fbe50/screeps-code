const TASK_TYPE = 'TaskRemote'

const remoteTaskConfigs = {
    fromCreep: { priority: 0, minUnits: 1, maxUnits: 1 },
    fromFlag: { priority: 0, minUnits: 1, maxUnits: 1 },
    powerBank: { priority: 0, minUnits: 1, maxUnits: 1 },
}

Room.prototype.addRemoteTask = function (key, sourceType) {
    if (!(sourceType in remoteTaskConfigs)) return false
    const { priority, minUnits, maxUnits } = remoteTaskConfigs[sourceType]
    const data = { sourceType }
    return this.addTask(TASK_TYPE, key, data, priority, 0, minUnits, 0, maxUnits)
}

const fromCreep = {
    source: (creep) => {
        //
    },
    target: (creep) => {
        //
    }
}

const fromFlag = {
    source: (creep) => {
        if (creep.isFull) return true
        creep.getFrom(Game.flags[creep.memory.task.key].pos.lookForStructure('terminal'))
    },
    target: (creep) => {
        if (creep.isEmpty) return true
        creep.putTo(creep.room.storage)
    }
}

const powerBank = {}

module.exports = { fromCreep, fromFlag, powerBank }
