const TASK_TYPE = 'TaskCenter'

const centerTaskConfigs = {
    centerLink: { priority: 9 },
    factory: { priority: 3 },
    storage: { priority: 5 },
    terminal: { priority: 7 }
}

Room.prototype.addCenterTask = function (key, source, target, resourceType, amount) {
    if (!(key in centerTaskConfigs) || (typeof amount !== 'number')) return false
    const data = { source, target, resourceType, amount }
    return this.addTask(TASK_TYPE, key, data, centerTaskConfigs[key].priority)
}

Room.prototype.handleCenterTask = function (key, amount) {
    const data = this.getTask(TASK_TYPE, key).data
    data.amount -= amount
    if (data.amount <= 0) return this.removeTask(TASK_TYPE, key)
    return this.updateTask(TASK_TYPE, key, { data })
}
