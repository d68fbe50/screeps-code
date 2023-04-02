const mount_role = require('./role')

const importantRoles = ['harvester', 'transporter']
const TASK_TYPE = 'TaskSpawn'

StructureSpawn.prototype.run = function () {
    if (this.spawning || this.room.memory[TASK_TYPE].length === 0 || this.room.memory.spawnLock > Game.time) return
    delete this.room.memory.spawnLock
    const task = this.room.getFirstTask(TASK_TYPE)
    if (!task) return

    const { key, data } = task
    const role = data.role
    const roleRequire = mount_role[role].require
    if (!roleRequire || !roleRequire.bodys) {
        this.room.removeTask(TASK_TYPE, key)
        this.log(`${key} 找不到角色或身体配置`, 'error')
        return
    }
    const bodys = calcBodyPart(roleRequire.bodys, importantRoles.includes(role) ? this.room.energyAvailable : this.room.energyCapacityAvailable)

    const result = this.spawnCreep(bodys, key, { memory: _.cloneDeep(data) })
    if (result === OK) {
        if (role === 'transporter') this.room.memory.spawnLock = Game.time + bodys.length * 3 + 50
        this.room.removeTask(TASK_TYPE, key)
    }
    else if (result === ERR_NAME_EXISTS) this.room.removeTask(TASK_TYPE, key)
    else if (result === ERR_NOT_ENOUGH_ENERGY) !importantRoles.includes(role) && this.room.lockTask(TASK_TYPE, key, 10)
    else {
        this.room.removeTask(TASK_TYPE, key)
        this.log(`${key} 生成失败，错误码 ${result}，任务数据 ${JSON.stringify(task)}`, 'error')
    }
}

function calcBodyPart(bodysRequire, energyAmount) {
    const energyLevels = [10000, 5600, 2300, 1800, 1300, 800, 550, 300]
    let index = energyLevels.findIndex(i => i <= energyAmount)
    const level = 7 - (index === -1 ? 7 : index)
    const bodysConfig = bodysRequire[level]
    const bodys = []
    for (let i = 0; i < bodysConfig.length / 2; i++) {
        bodys.push(...Array(bodysConfig[i*2+1]).fill(bodysConfig[i*2]))
    }
    return [].concat(...bodys)
}
