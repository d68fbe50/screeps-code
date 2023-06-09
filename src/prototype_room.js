const defendBoostTypes = ['XUH2O', 'XZHO2', 'XLHO2', 'XKHO2', 'XGHO2', 'XLH2O']
const warBoostTypes = ['XUH2O', 'XZHO2', 'XLHO2', 'XKHO2', 'XGHO2', 'XZH2O']
const upgradeBoostTypes = ['XGH2O']

Room.prototype.log = function (content, type = 'info', notifyNow = false, prefix = '') {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]&nbsp;</a>${prefix}`
    log(content, type, notifyNow, prefix)
}

Room.prototype.checkRoomMemory = function () {
    if (!this.memory.labs) this.memory.labs = {}
    if (!this.memory.sourceContainerIds) this.memory.sourceContainerIds = []
    if (!this.memory.TaskCenter) this.memory.TaskCenter = []
    if (!this.memory.TaskRemote) this.memory.TaskRemote = []
    if (!this.memory.TaskSpawn) this.memory.TaskSpawn = []
    if (!this.memory.TaskTransport) this.memory.TaskTransport = []
    if (!this.memory.TaskWork) this.memory.TaskWork = []
}

Room.prototype.collectRoomStats = function () {
    Memory.stats[this.name + '-rcl'] = this.controller.level
    Memory.stats[this.name + '-rclPercent'] = this.controller.progress / this.controller.progressTotal * 100 || -1
    Memory.stats[this.name + '-energy'] = this[energy]
}

Room.prototype.onNormal = function () {
    this.boostLabs.forEach(i => i.offBoost())
    this.memory.state = state.Normal
    this.log(`房间已切换至 ${this.memory.state} 模式`)
}

Room.prototype.onDefend = function () {
    this.boostLabs.forEach(i => i.offBoost())
    defendBoostTypes.forEach((t, index) => this.reactionLabs[index] && this.reactionLabs[index].onBoost(t))
    this.memory.state = state.Defend
    this.log(`房间已切换至 ${this.memory.state} 模式`)
}

Room.prototype.onWar = function () {
    this.boostLabs.forEach(i => i.offBoost())
    warBoostTypes.forEach((t, index) => this.reactionLabs[index] && this.reactionLabs[index].onBoost(t))
    this.memory.state = state.War
    this.log(`房间已切换至 ${this.memory.state} 模式`)
}

Room.prototype.onNukerEmergency = function () {
    this.boostLabs.forEach(i => i.offBoost())
    this.memory.state = state.NukerEmergency
    this.log(`房间已切换至 ${this.memory.state} 模式`)
}

Room.prototype.onUpgrade = function () {
    this.boostLabs.forEach(i => i.offBoost())
    upgradeBoostTypes.forEach((t, index) => this.reactionLabs[index] && this.reactionLabs[index].onBoost(t))
    this.memory.state = state.Upgrade
    this.log(`房间已切换至 ${this.memory.state} 模式`)
}

Room.prototype.resAvailable = function (resourceType, amount = 1) {
    if (this.storage && this.storage.store[resourceType] >= amount) return this.storage
    if (this.terminal && this.terminal.store[resourceType] >= amount) return this.terminal
}

Room.prototype.resAmount = function (resourceType) {
    const amountInStorage = this.storage ? this.storage.store[resourceType] : 0
    const amountInTerminal = this.terminal ? this.terminal.store[resourceType] : 0
    return amountInStorage + amountInTerminal
}

Room.prototype.roomVisual = function () {
    let visualTextY = 20

    this.visual.text(`RoomState: ${this.memory.state}`, 1, visualTextY++, { align: 'left' })

    this.visual.text(`Worker: ${this.memory.workerAmount}, Upgrader: ${this.memory.upgraderAmount}`, 1, visualTextY++, { align: 'left' })

    let text = 'TaskCenter : ' + this.memory['TaskCenter'].map(i => `[${i.data.source}>${i.data.target}:${i.data.resourceType}*${i.data.amount}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskRemote : ' + this.memory['TaskRemote'].map(i => `[${i.data.sourceType}:${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskSpawn : ' + this.memory['TaskSpawn'].map(i => `[${i.data.role}:${i.key}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskTransport : ' + this.memory['TaskTransport'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })

    text = 'TaskWork : ' + this.memory['TaskWork'].map(i => `[${i.key},${i.minUnits},${i.nowUnits},${i.maxUnits}]`).join(' ')
    this.visual.text(text, 1, visualTextY++, { align: 'left' })
}

Object.defineProperty(Room.prototype, 'state', {
    get() {
        if (!this.memory.state) this.memory.state = state.Normal
        return this.memory.state
    },
    configurable: true
})
