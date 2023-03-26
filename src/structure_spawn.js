const { roleRequires } = require('./prototype_creep')

const importantRoles = ['starter', 'harvester', 'transporter']
const TASK_TYPE = 'TaskSpawn'

StructureSpawn.prototype.run = function () {
    if (this.room.memory.spawnLock > Game.time) return
    else delete this.room.memory.spawnLock
    if (this.spawning) {
        if (this.spawning.needTime - this.spawning.remainingTime === 1) this.room.addTransportTask('fillExtension')
        return
    }
    if (this.room.memory.TaskSpawn.length === 0) return
    const task = this.room.getFirstTask(TASK_TYPE)
    if (!task) return

    const { key, data } = task
    const role = data.role
    const roleRequire = roleRequires[role]
    if (!roleRequire || !roleRequire.bodys) {
        this.room.removeTask(TASK_TYPE, key)
        this.log(`${key} 找不到角色或身体配置`, 'error')
        return
    }

    const bodys = calcBodyPart(roleRequire.bodys, importantRoles.includes(role) ? this.room.energyAvailable : this.room.energyCapacityAvailable)

    const result = this.spawnCreep(bodys, key, { memory: _.cloneDeep(data) })
    if (result === OK || result === ERR_NAME_EXISTS) this.room.removeTask(TASK_TYPE, key)
    else if (result === ERR_NOT_ENOUGH_ENERGY) !importantRoles.includes(role) && this.room.lockTask(TASK_TYPE, key, 30)
    else {
        this.room.removeTask(TASK_TYPE, key)
        this.log(`${key} 生成失败，错误码 ${result}，任务数据 ${JSON.stringify(task)}`, 'error')
    }
}

StructureSpawn.prototype.onBuildComplete = function () {
    //
}

function calcBodyPart(bodysRequire, energyAmount) {
    const energyLevels = [10000, 5600, 2300, 1800, 1300, 800, 550, 300]
    let index = energyLevels.findIndex(i => i <= energyAmount)
    const level = 7 - (index === -1 ? 7 : index)
    const bodys = []
    Object.keys(bodysRequire[level]).forEach(i => bodys.push(...Array(bodysRequire[level][i]).fill(i)))
    return bodys
}
