const { roleRequires } = require('./prototype_creep')

const importantRoles = ['harvester', 'transporter']

StructureSpawn.prototype.run = function () {
    if (this.spawning) return
    const task = this.room.getSpawnTask()
    if (!task) return

    const { key, taskData } = task
    const role = taskData.role
    const roleRequire = roleRequires[role]
    if (!roleRequire) return this.room.removeSpawnTask(key)

    const bodys = roleRequire.bodys ? roleRequire.bodys(this.room, this) : [WORK, CARRY, MOVE]
    if (bodys.length <= 0) return this.room.lockSpawnTask(key, 30)

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
