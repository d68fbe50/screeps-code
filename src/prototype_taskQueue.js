const centerTaskTypes = {
    centerLink: 9,
    factory: 3,
    storage: 5,
    terminal: 7
}

const spawnTaskTypes = { // 注意与 prototype_creep.js 的 roleRequires 保持一致
    centerTransporter: 7, // priority
    claimer: 0,
    defender: 6,
    depoDefender: 0,
    depoHarvester: 0,
    harvester: 9,
    helper: 0,
    mineHarvester: 0,
    powerAttacker: 0,
    powerDefender: 0,
    powerHealer: 0,
    powerTransporter: 0,
    remoteHarvester: 0,
    remoteDefender: 0,
    remoteTransporter: 0,
    reserver: 0,
    squadAttacker: 5,
    squadDismantler: 5,
    squadHealer: 5,
    squadRanged: 5,
    starter: 0,
    transporter: 8,
    upgrader: 0,
    worker: 0
}

const transportTaskTypes = {
    fillExtension: 9,
    fillTower: 7,
    labEnergy: 5,
    labIn: 5,
    labOut: 5,
    nukerEnergy: 0,
    nukerG: 0,
    powerSpawnEnergy: 1,
    powerSpawnPower: 1,
    sourceContainerOut: 0,
    upgradeContainerIn: 0
}

const workTaskTypes = {
    build: 9,
    repair: 6,
    upgrade: 3
}

// task prototype --------------------------------------------------------------------------------

Room.prototype.addCenterTask = function (key, source, target, resourceType, amount) {
    if (!(key in centerTaskTypes)) return false
    const data = { source, target, resourceType, amount }
    return this.addTask('TaskCenter', key, data, centerTaskTypes[key])
}

Room.prototype.handleCenterTask = function (key, amount) {
    const type = 'TaskCenter'
    const data = this.getTask(type, key).data
    data.amount -= amount
    if (data.amount <= 0) return this.removeTask(type, key)
    return this.updateTask(type, key, { data })
}

Room.prototype.addSpawnTask = function (key, creepMemory) {
    if (key in Game.creeps || !creepMemory || !(creepMemory.role in spawnTaskTypes)) return false
    const result = this.addTask('TaskSpawn', key, creepMemory, spawnTaskTypes[creepMemory.role])
    if (result && !Memory.allCreeps.includes(key)) Memory.allCreeps.push(key)
    return result
}

Room.prototype.removeSpawnTaskByRole = function (role) {
    if (!role) return false
    const type = 'TaskSpawn'
    const task = this.memory[type].find(i => i.data && i.data.role === role)
    if (!task) return false
    const result = this.removeTask(type, task.key)
    if (result) {
        Memory.allCreeps = _.pull(Memory.allCreeps, task.key)
        this.log(`spawnTask: ${task.key} 已移除`, 'notify')
    }
    return result
}

Room.prototype.addTransportTask = function (key, minUnits, maxUnits) {
    if (!(key in transportTaskTypes)) return false
    return this.addTask('TaskTransport', key, undefined, transportTaskTypes[key], undefined, minUnits, 0, maxUnits)
}

Room.prototype.addWorkTask = function (key, minUnits, maxUnits) {
    if (!(key in workTaskTypes)) return false
    return this.addTask('TaskWork', key, undefined, workTaskTypes[key], undefined, minUnits, 0, maxUnits)
}

// TaskBase --------------------------------------------------------------------------------------

Room.prototype.getTask = function (type, key) {
    if (!type || !key) return undefined
    return this.memory[type].find(i => i.key === key)
}

Room.prototype.getTaskIndex = function (type, key) {
    if (!type || !key) return -1
    return this.memory[type].findIndex(i => i.key === key)
}

Room.prototype.getFirstTask = function (type) { // 用于 centerTask & spawnTask
    if (!type) return undefined
    return this.memory[type].find(i => !i.lockTime || Game.time > i.lockTime)
}

Room.prototype.getExpectTask = function (type) { // 用于 transportTask & workTask
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

Room.prototype.updateTask = function (type, key, content) { // content sample { data: { role: 'harvester' }, maxUnits = 1 }
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
