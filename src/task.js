const taskActions = {
    TaskCenter: require('./task_centerTransport'),
    TaskPowerCreep: require('./task_powerCreep'),
    TaskRemote: require('./task_remoteTransport'),
    TaskSpawn: require('./task_spawn'),
    TaskTransport: require('./task_transport'),
    TaskWork: require('./task_work')
}

Creep.prototype.runTaskSource = function (taskType, actionType = 'key') {
    if (this.room.memory[taskType].length === 0) {
        this.memory.task = {}
        return false
    }
    if (!this.memory.task.key) {
        this.receiveTask(taskType)
        if (!this.memory.task.key) return false
    }
    const task = this.room.getTask(taskType, this.memory.task.key)
    if (!task) {
        this.memory.task = {}
        return false
    }
    const taskAction = taskActions[taskType]
    const action = taskAction[task[actionType]] || taskAction[task.data[actionType]]
    if (!this.memory.task.ready) {
        if (action.prepare) this.memory.task.ready = action.prepare(this)
        else this.memory.task.ready = true
    }
    if (!this.memory.task.ready) return false
    if (!action || !action.source) return false
    const result = action.source(this)
    if (result === true) return true
    else if (result === false) return false
    else {
        this.room.removeTask(taskType, task.key)
        this.memory.task = {}
    }
}

Creep.prototype.runTaskTarget = function (taskType, actionType = 'key') {
    const task = this.room.getTask(taskType, this.memory.task.key)
    if (!task) return true
    const taskAction = taskActions[taskType]
    const action = taskAction[task[actionType]] || taskAction[task.data[actionType]]
    if (!action || !action.target) return true
    const result = action.target(this)
    if (result === true) {
        this.revertTask(taskType)
        return true
    }
    else if (result === false) return false
    else {
        this.room.removeTask(taskType, task.key)
        this.memory.task = {}
        return true
    }
}

Room.prototype.getTask = function (type, key) {
    if (!type || !key) return undefined
    return this.memory[type].find(i => i.key === key)
}

Room.prototype.getTaskIndex = function (type, key) {
    if (!type || !key) return -1
    return this.memory[type].findIndex(i => i.key === key)
}

Room.prototype.getFirstTask = function (type) {
    if (!type) return undefined
    return this.memory[type].find(i => !i.lockTime || Game.time > i.lockTime)
}

Room.prototype.getExpectTask = function (type) {
    if (!type) return undefined
    let task = this.memory[type].find(i => i.nowUnits < i.minUnits)
    if (!task) task = this.memory[type].find(i => i.nowUnits < i.maxUnits)
    return task
}

Room.prototype.addTask = function (type, key, data = {}, priority = 0, lockTime = 0, minUnits = 1, nowUnits = 0, maxUnits = 1) {
    if (!type || !key || this.getTask(type, key)) return false
    let index = this.memory[type].findIndex(i => i.priority < priority)
    index = index === -1 ? this.memory[type].length : index
    this.memory[type].splice(index, 0, { key, data, priority, lockTime, minUnits, nowUnits, maxUnits })
    return key
}

Room.prototype.removeTask = function (type, key) {
    if (!type || !key) return false
    const index = this.getTaskIndex(type, key)
    if (index === -1) return false
    this.memory[type].splice(index, 1)
    return key
}

Room.prototype.updateTask = function (type, key, content) {
    if (!type || !key || !content) return false
    const index = this.getTaskIndex(type, key)
    if (index === -1) return false
    Object.keys(content).forEach(i => this.memory[type][index][i] = content[i])
    return key
}

Room.prototype.updateTaskPriority = function (type, key, priority) {
    if (!type || !key || priority === undefined) return false
    const t = this.getTask(type, key)
    if (!t) return false
    if (t.priority === priority) return key
    this.removeTask(type, key)
    return this.addTask(type, key, _.cloneDeep(t.data), priority, t.lockTime, t.minUnits, t.nowUnits, t.maxUnits)
}

Room.prototype.updateTaskUnit = function (type, key, amount) {
    if (!type || !key || !amount) return false
    const index = this.getTaskIndex(type, key)
    if (index === -1) return false
    this.memory[type][index].nowUnits += amount
    return key
}

Room.prototype.lockTask = function (type, key, tick) {
    if (!type || !key || tick === undefined) return false
    const index = this.getTaskIndex(type, key)
    if (index === -1) return false
    this.memory[type][index].lockTime = Game.time + tick
    return key
}
