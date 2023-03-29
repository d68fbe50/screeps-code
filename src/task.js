const taskActions = {
    TaskCenter: require('./task_centerTransport'),
    TaskPowerCreep: require('./task_powerCreep'),
    TaskRemote: require('./task_remoteTransport'),
    TaskSpawn: require('./task_spawn'),
    TaskTransport: require('./task_transport'),
    TaskWork: require('./task_work')
}

// =================================================================================================== Creep prototype

Creep.prototype.receiveTask = function (type) {
    const task = this.room.getExpectTask(type)
    if (task) {
        this.memory.task = _.cloneDeep(task)
        this.room.updateTaskUnit(type, task.key, 1)
    }
    return task
}

Creep.prototype.revertTask = function (type) {
    this.room.updateTaskUnit(type, this.memory.task.key, -1)
    this.memory.task = {}
    return true
}

Creep.prototype.runTaskSource = function (taskType, actionType = 'key') {
    if (this.room.memory[taskType].length === 0) return !(delete this.memory.task)
    if (!this.memory.task.key && !this.receiveTask(taskType)) return false
    const task = this.room.getTask(taskType, this.memory.task.key)
    if (!task) return !(delete this.memory.task)
    const action = taskActions[taskType][task[actionType]] || taskActions[taskType][task.data[actionType]]
    if (!action || !action.source) return false
    return action.source(this)
}

Creep.prototype.runTaskTarget = function (taskType, actionType = 'key') {
    const task = this.room.getTask(taskType, this.memory.task.key)
    if (!task) return true
    const action = taskActions[taskType][task[actionType]] || taskActions[taskType][task.data[actionType]]
    if (!action || !action.target) return true
    const result = action.target(this)
    if (result) this.revertTask(taskType)
    return result
}

// =================================================================================================== Room prototype

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

Room.prototype.updateTask = function (type, key, content) { // content sample { data: { role: 'harvester' }, maxUnits: 1 }
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

Room.prototype.testTaskQueue = function () {
    this.memory.TaskTest = []
    this.addTask('TaskTest', 'test1', { data1: 'oldValue1' }, 1)
    this.addTask('TaskTest', 'test2', undefined, 2)
    this.addTask('TaskTest', 'test3', undefined, 3)
    this.removeTask('TaskTest', 'test3')
    this.updateTask('TaskTest', 'test1', { data: { data1: 'value1' }, maxUnits: 2 })
    this.updateTaskPriority('TaskTest', 'test1', 3)
    this.updateTaskUnit('TaskTest', 'test1', 1)
    this.lockTask('TaskTest', 'test1', 50)
    const index = this.getTaskIndex('TaskTest', 'test1')
    const t = this.memory.TaskTest[index]
    const result = this.getFirstTask('TaskTest').key === 'test2' && t.key === 'test1' && t.lockTime > 0 && t.data && t.data.data1 === 'value1' && t.nowUnits === 1 && t.maxUnits === 2
    console.log(result ? '测试通过' : 'ERROR: 测试未通过！！！')
    delete this.memory.TaskTest
}
