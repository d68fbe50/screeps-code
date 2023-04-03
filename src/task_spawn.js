const TASK_TYPE = 'TaskSpawn'

const mount_role = require('./role')

Room.prototype.addSpawnTask = function (key, creepMemory) {
    if (key in Game.creeps || !creepMemory || !(creepMemory.role in mount_role)) return false
    const result = this.addTask(TASK_TYPE, key, creepMemory, mount_role[creepMemory.role].priority)
    if (result && !Memory.allCreeps.includes(key)) Memory.allCreeps.push(key)
    return result
}

Room.prototype.removeSpawnTaskByRole = function (role) {
    if (!role) return false
    const task = this.memory[TASK_TYPE].find(i => i.data && i.data.role === role)
    if (!task) return false
    const result = this.removeTask(TASK_TYPE, task.key)
    if (result) {
        Memory.allCreeps = _.pull(Memory.allCreeps, task.key)
        this.log(`${TASK_TYPE}: ${task.key} 已移除`)
    }
    return result
}
