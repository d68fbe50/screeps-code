const { SUBMIT_STRUCTURE_TYPES, ROLE_TYPES, TRANSPORT_TYPES, WORK_TYPES } = require('./config')

const TASK_TYPES = [ 'TaskCenterTransport', 'TaskSpawn', 'TaskTransport', 'TaskWork' ]

// TaskBase --------------------------------------------------------------------------------------

Room.prototype.printTasks = function (taskType) {
    return taskType + ' : [\n\t' + this.memory[taskType].map(i => JSON.stringify(i)).join(',\n\t') + '\n]'
}

Room.prototype.printTaskKeys = function (taskType) {
    return taskType + ' : ' + this.memory[taskType].map(i => i.key).join(', ')
}

Room.prototype.getTask = function (taskType, key = undefined) {
    if (key) return this.memory[taskType].find(i => i.key === key)
    return this.memory[taskType].find(i => !i.taskData || !i.taskData.lock || i.taskData.lock < Game.time)
}

Room.prototype.getTaskIndex = function (taskType, key) {
    return this.memory[taskType].findIndex(i => i.key === key)
}

Room.prototype.addTask = function (taskType, key, priority = 0, taskData = {}) {
    if (this.getTask(taskType, key)) return false
    let index = this.memory[taskType].findIndex(i => i.priority < priority)
    index = index === -1 ? this.memory[taskType].length : index
    this.memory[taskType].splice(index, 0, { key, priority, taskData })
    return key
}

Room.prototype.removeTask = function (taskType, key) {
    const index = this.getTaskIndex(taskType, key)
    if (index === -1) return false
    this.memory[taskType].splice(index, 1)
    return key
}

Room.prototype.updateTask = function (taskType, key, priority = undefined, taskData = undefined) {
    const index = this.getTaskIndex(taskType, key)
    if (index === -1) return false
    if (taskData) this.memory[taskType][index].taskData = taskData
    const oldTask = this.getTask(taskType, key)
    if (priority === undefined || oldTask.priority === priority) return key
    this.removeTask(taskType, key)
    return this.addTask(taskType, key, priority, oldTask.taskData)
}

// TaskCenterTransport ---------------------------------------------------------------------------

Room.prototype.getCenterTask = function (submit) {
    return this.getTask('TaskCenterTransport', submit)
}

Room.prototype.addCenterTask = function (submit, priority, source, target, resourceType, amount) {
    if (!(submit in SUBMIT_STRUCTURE_TYPES)) return false
    if (priority === undefined) priority = SUBMIT_STRUCTURE_TYPES[submit]
    const taskData = { source, target, resourceType, amount }
    return this.addTask('TaskCenterTransport', submit, priority, taskData)
}

Room.prototype.removeCenterTask = function (submit) {
    return this.removeTask('TaskCenterTransport', submit)
}

Room.prototype.updateCenterTask = function (submit, priority, taskData) {
    return this.updateTask('TaskCenterTransport', submit, priority, taskData)
}

Room.prototype.handleCenterTask = function (submit, amount) {
    const taskData = this.getCenterTask(submit).taskData
    taskData.amount -= amount
    if (taskData.amount <= 0) return this.removeCenterTask(submit)
    this.updateCenterTask(submit, undefined, taskData)    
}

// TaskSpawn -------------------------------------------------------------------------------------

Room.prototype.getSpawnTask = function (creepName) {
    return this.getTask('TaskSpawn', creepName)
}

Room.prototype.addSpawnTask = function (creepName, priority, creepMemory) {
    if (creepName in Game.creeps || !creepMemory || !(creepMemory.role in ROLE_TYPES)) return false
    if (priority === undefined) priority = ROLE_TYPES[creepMemory.role]
    const result = this.addTask('TaskSpawn', creepName, priority, creepMemory)
    if (result) Memory.allCreepNames.push(creepName)
    return result
}

Room.prototype.removeSpawnTask = function (creepName) {
    return this.removeTask('TaskSpawn', creepName)
}

Room.prototype.updateSpawnTask = function (creepName, priority, creepMemory) {
    return this.updateTask('TaskSpawn', creepName, priority, creepMemory)
}

Room.prototype.lockSpawnTask = function (creepName, tick = 30) {
    const taskData = this.getSpawnTask(creepName).taskData
    taskData.lock = Game.time + tick
    this.updateSpawnTask(creepName, undefined, taskData)
}

// TaskTransport ---------------------------------------------------------------------------------

Room.prototype.getTransportTask = function (transportType) {
    return this.getTask('TaskTransport', transportType)
}

Room.prototype.addTransportTask = function (transportType, priority) {
    if (!(transportType in TRANSPORT_TYPES)) return false
    if (priority === undefined) priority = TRANSPORT_TYPES[transportType]
    const taskData = {}
    return this.addTask('TaskTransport', transportType, priority, taskData)
}

Room.prototype.removeTransportTask = function (transportType) {
    return this.removeTask('TaskTransport', transportType)
}

Room.prototype.updateTransportTask = function (transportType, priority, taskData) {
    return this.updateTask('TaskTransport', transportType, priority, taskData)
}

// TaskWork --------------------------------------------------------------------------------------

Room.prototype.getWorkTask = function (workType) {
    return this.getTask('TaskWork', workType)
}

Room.prototype.addWorkTask = function (workType, priority, needAmount, workingAmount) {
    if (!(workType in WORK_TYPES)) return false
    if (priority === undefined) priority = WORK_TYPES[workType]
    const taskData = { needAmount, workingAmount }
    return this.addTask('TaskWork', workType, priority, taskData)
}

Room.prototype.removeWorkTask = function (workType) {
    return this.removeTask('TaskWork', workType)
}

Room.prototype.updateWorkTask = function (workType, priority, taskData) {
    return this.updateTask('TaskWork', workType, priority, taskData)
}
