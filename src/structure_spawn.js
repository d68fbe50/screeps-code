const { roleRequires } = require('./prototype_creep')

const importantRoles = ['harvester', 'transporter']

StructureSpawn.prototype.run = function () {
    if (this.spawning) return
    const task = this.room.getSpawnTask()
    if (!task) return

    const { key, taskData } = task
    const role = taskData.role
    const roleRequire = roleRequires[role]
    if (!roleRequire || !roleRequire.bodys) {
        this.room.removeSpawnTask(key)
        this.log(`${key} 找不到角色或身体配置`, 'error')
        return
    }

    const bodys = calcBodyPart(roleRequire.bodys, this.room.energyCapacityAvailable)

    const result = this.spawnCreep(bodys, key, { memory: _.cloneDeep(taskData) })
    if (result === OK || result === ERR_NAME_EXISTS) this.room.removeSpawnTask(key)
    else if (result === ERR_NOT_ENOUGH_ENERGY) !importantRoles.includes(role) && this.room.lockSpawnTask(key, 30)
    else {
        this.room.removeSpawnTask(key)
        this.log(`${key} 生成失败，错误码 ${result}，任务数据 ${JSON.stringify(task)}`, 'error')
    }
}

StructureSpawn.prototype.onBuildComplete = function () {
    //
}

function calcBodyPart(bodysRequire, energyCapacityAvailable) {
    const energyLevels = [10000, 5600, 2300, 1800, 1300, 800, 550, 300]
    const level = 7 - energyLevels.findIndex(i => i <= energyCapacityAvailable)
    const bodys = []
    Object.keys(bodysRequire[level]).forEach(i => bodys.push(...Array(bodysRequire[level][i]).fill(i)))
    return bodys
}
