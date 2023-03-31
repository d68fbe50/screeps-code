const TASK_TYPE = 'TaskRemote'

const remoteTaskConfigs = {
    fromCreep: { priority: 0, minUnits: 1, maxUnits: 1 },
    fromFlag: { priority: 0, minUnits: 1, maxUnits: 1 },
    powerBank: { priority: 0, minUnits: 1, maxUnits: 1 },
}

const excludeResourceTypes = ['energy', 'ops', 'O', 'H', 'Z', 'K', 'U', 'L', 'X']

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
        const flag = Game.flags[creep.memory.task.key]
        if (!flag) return undefined
        if (!creep.gotoFlag(creep.memory.task.key)) return false
        const dropped = flag.pos.lookFor(LOOK_RESOURCES)[0]
        if (dropped) {
            creep.getFrom(dropped, dropped.resourceType)
            return false
        }
        const source = [...flag.pos.lookFor(LOOK_RUINS), ...flag.pos.lookFor(LOOK_STRUCTURES)].find(i => i.store && i.store.getUsedCapacity() > 0)
        if (source) {
            const resourceType = Object.keys(source.store).find(i => !excludeResourceTypes.includes(i) && source.store[i] > 0)
            if (resourceType) {
                creep.getFrom(source, resourceType)
                return false
            }
        }
        flag.remove()
        creep.memory.dontNeed = true
        return true
    },
    target: (creep) => {
        if (creep.isEmpty) return true
        if (!creep.goBackHome()) return false
        creep.clearCarry()
        return false
    }
}

const powerBank = {}

module.exports = { fromCreep, fromFlag, powerBank }
