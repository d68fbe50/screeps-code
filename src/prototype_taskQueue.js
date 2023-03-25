const { SUBMIT_STRUCTURE_TYPES, ROLE_TYPES, TRANSPORT_TYPES, WORK_TYPES } = require('./config')

Room.prototype.printAllTask = function (taskType) {
    return taskType + ' : [\n\t' + this.memory[taskType].map(i => JSON.stringify(i)).join(',\n\t') + '\n]'
}

Room.prototype.printAllTaskKeys = function (taskType) {
    return taskType + ' : ' + this.memory[taskType].map(i => i.key).join(', ')
}

// TaskBase --------------------------------------------------------------------------------------

const getTask = function (room, type, key = undefined) {
    if (!type) return undefined
    if (key) return room.memory[type].find(i => i.key === key)
    return room.memory[type].find(i => !i.lockTime || Game.time > i.lockTime)
}

const getTaskIndex = function (room, type, key) {
    if (!type || !key) return -1
    return room.memory[type].findIndex(i => i.key === key)
}

const addTask = function (room, type, key, data = {}, priority = 0, lockTime = 0, minUnits = 0, nowUnits = 0, maxUnits = 0) {
    if (!type || !key || getTask(room, type, key)) return false
    let index = room.memory[type].findIndex(i => i.priority < priority)
    index = index === -1 ? room.memory[type].length : index
    room.memory[type].splice(index, 0, { key, data, priority, lockTime, minUnits, nowUnits, maxUnits })
    return key
}

const removeTask = function (room, type, key) {
    if (!type || !key) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    room.memory[type].splice(index, 1)
    return key
}

const updateTask = function (room, type, key, content) { // content sample { data: { role: 'harvester' }, maxUnits = 1 }
    if (!type || !key || !content) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    Object.keys(content).forEach(k => room.memory[type][index][k] = content[k])
    return key
}

const updateTaskPriority = function (room, type, key, priority) {
    if (!type || !key || priority === undefined) return false
    const t = getTask(room, type, key)
    if (!t) return false
    if (t.priority === priority) return key
    removeTask(room, type, key)
    return addTask(room, type, key, _.cloneDeep(t.data), priority, t.lockTime, t.minUnits, t.nowUnits, t.maxUnits)
}

const lockTask = function (room, type, key, tick) {
    if (!type || !key || tick === undefined) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    room.memory[type][index].lockTime = Game.time + tick
    return key
}

const unlockTask = function (room, type, key) {
    if (!type || !key) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    room.memory[type][index].lockTime = 0
    return key
}

const addTaskUnit = function (room, type, key) {
    if (!type || !key) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    room.memory[type][index].nowUnits += 1
    return key
}

const reduceTaskUnit = function (room, type, key) {
    if (!type || !key) return false
    const index = getTaskIndex(room, type, key)
    if (index === -1) return false
    room.memory[type][index].nowUnits -= 1
    return key
}

Room.prototype.testTaskQueue = function () {
    this.memory.TaskTest = []
    addTask(this, 'TaskTest', 'test1', { data1: 'oldValue1' }, 1, 0, 1, 0, 1)
    addTask(this, 'TaskTest', 'test2', undefined, 2, 20)
    addTask(this, 'TaskTest', 'test3', undefined, 3)
    removeTask(this, 'TaskTest', 'test3')
    updateTask(this, 'TaskTest', 'test1', { data: { data1: 'value1' }, maxUnits: 2 })
    updateTaskPriority(this, 'TaskTest', 'test1', 3)
    lockTask(this, 'TaskTest', 'test1', 50)
    unlockTask(this, 'TaskTest', 'test2')
    addTaskUnit(this, 'TaskTest', 'test1')
    addTaskUnit(this, 'TaskTest', 'test1')
    reduceTaskUnit(this, 'TaskTest', 'test1')
    const index = getTaskIndex(this, 'TaskTest', 'test1')
    const t = this.memory.TaskTest[index]
    const result = getTask(this, 'TaskTest').key === 'test2' && t.key === 'test1' && t.lockTime > 0 && t.data && t.data.data1 === 'value1' && t.nowUnits === 1 && t.maxUnits === 2
    console.log(result ? '测试通过' : 'ERROR: 测试未通过！！！')
    delete this.memory.TaskTest
}

// TaskCenterTransport ---------------------------------------------------------------------------

Room.prototype.getCenterTask = function (key) {
    return getTask(this, 'TaskCenterTransport', key)
}

Room.prototype.addCenterTask = function (key, priority, source, target, resourceType, amount) {
    if (!(key in SUBMIT_STRUCTURE_TYPES)) return false
    if (priority === undefined) priority = SUBMIT_STRUCTURE_TYPES[key]
    const data = { source, target, resourceType, amount }
    return addTask(this, 'TaskCenterTransport', key, data, priority)
}

Room.prototype.removeCenterTask = function (key) {
    return removeTask(this, 'TaskCenterTransport', key)
}

Room.prototype.handleCenterTask = function (key, amount) {
    const data = this.getCenterTask(key).data
    data.amount -= amount
    if (data.amount <= 0) return this.removeCenterTask(key)
    return updateTask(this, 'TaskCenterTransport', key, { data })
}

// TaskSpawn -------------------------------------------------------------------------------------

Room.prototype.getSpawnTask = function (key) {
    return getTask(this, 'TaskSpawn', key)
}

Room.prototype.addSpawnTask = function (key, creepMemory, priority) {
    if (key in Game.creeps || !creepMemory || !(creepMemory.role in ROLE_TYPES)) return false
    if (priority === undefined) priority = ROLE_TYPES[creepMemory.role]
    const result = addTask(this, 'TaskSpawn', key, creepMemory, priority)
    if (result) Memory.allCreepNameList.push(key)
    return result
}

Room.prototype.removeSpawnTask = function (key) {
    return removeTask(this, 'TaskSpawn', key)
}

Room.prototype.lockSpawnTask = function (key, tick = 30) {
    return lockTask(this, 'TaskSpawn', key, tick)
}

// TaskTransport ---------------------------------------------------------------------------------

Room.prototype.getTransportTask = function (key) {
    return getTask(this, 'TaskTransport', key)
}

Room.prototype.addTransportTask = function (key, priority) {
    if (!(key in TRANSPORT_TYPES)) return false
    if (priority === undefined) priority = TRANSPORT_TYPES[key]
    return addTask(this, 'TaskTransport', key, undefined, priority)
}

Room.prototype.removeTransportTask = function (key) {
    return removeTask(this, 'TaskTransport', key)
}

// TaskWork --------------------------------------------------------------------------------------

Room.prototype.getWorkTask = function (key) {
    return getTask(this, 'TaskWork', key)
}

Room.prototype.addWorkTask = function (key, priority, minUnits, maxUnits) {
    if (!(key in WORK_TYPES)) return false
    if (priority === undefined) priority = WORK_TYPES[key]
    return addTask(this, 'TaskWork', key, undefined, priority, undefined, minUnits, 0, maxUnits)
}

Room.prototype.removeWorkTask = function (key) {
    return removeTask(this, 'TaskWork', key)
}
