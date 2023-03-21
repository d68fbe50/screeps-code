Room.prototype.printTasks = function(taskType) {
    if (!this.memory[taskType]) this.memory[taskType] = []
    return taskType + ' : [\n\t' + this.memory[taskType].map(i => JSON.stringify(i)).join(',\n\t') + '\n]'
}

Room.prototype.printTaskKeys = function(taskType) {
    if (!this.memory[taskType]) this.memory[taskType] = []
    return taskType + ' : ' + this.memory[taskType].map(i => i.key).join(', ')
}

Room.prototype.getTask = function(taskType, key = undefined) {
    if (!this.memory[taskType]) this.memory[taskType] = []
    if (!key) return this.memory[taskType][0]
    return this.memory[taskType].find(i => i.key === key)
}

Room.prototype.getTaskIndex = function(taskType, key) {
    if (!this.memory[taskType]) this.memory[taskType] = []
    return this.memory[taskType].findIndex(i => i.key === key)
}

Room.prototype.addTask = function(taskType, key, priority = 0, taskData = {}) {
    if (this.getTask(taskType, key)) return false
    let index = this.memory[taskType].findIndex(i => i.priority < priority)
    index = index === -1 ? this.memory[taskType].length : index
    this.memory[taskType].splice(index, 0, { key, priority, taskData })
    return true
}

Room.prototype.removeTask = function(taskType, key) {
    const index = this.getTaskIndex(taskType, key)
    if (index === -1) return false
    this.memory[taskType].splice(index, 1)
    return true
}

Room.prototype.updateTask = function(taskType, key, priority = 0, taskData) {
    const index = this.getTaskIndex(taskType, key)
    if (index === -1) return false
    if (taskData) {
        this.memory[taskType][index].taskData = taskData
        return true
    }
    const oldTask = this.getTask(taskType, key)
    if (oldTask.priority === priority) return true
    this.removeTask(taskType, key)
    this.addTask(taskType, key, priority, oldTask.taskData)
    return true
}
