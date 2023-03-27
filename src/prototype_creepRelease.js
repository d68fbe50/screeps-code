const roleShortNames = {
    centerTransporter: 'c',
    claimer: 'r',
    defender: 'd',
    depoDefender: 'dp',
    depoHarvester: 'dp',
    harvester: 'h',
    helper: 'hp',
    mineHarvester: 'm',
    powerAttacker: 'pw',
    powerDefender: 'pw',
    powerHealer: 'pw',
    powerTransporter: 'pw',
    remoteHarvester: 'r',
    remoteDefender: 'r',
    remoteTransporter: 'r',
    reserver: 'r',
    squadAttacker: 'x',
    squadDismantler: 'x',
    squadHealer: 'x',
    squadRanged: 'x',
    starter: 's',
    transporter: 't',
    upgrader: 'u',
    worker: 'w'
}

// transporter & worker --------------------------------------------------------------------------

Room.prototype.addCreep = function (role, amount = 1) {
    if (role !== 'transporter' && role !== 'worker') return
    for (let i = 0; i < amount; i++) {
        const dontNeedName = Object.keys(Memory.creeps).find(i => Memory.creeps[i].role === role && Memory.creeps[i].dontNeed)
        if (dontNeedName) {
            Memory.creeps[dontNeedName].dontNeed = undefined
            this.log(`creep: ${dontNeedName} 已取消 dontNeed 标记`, 'success')
            continue
        }
        const creepName = getAvailableCreepName(roleShortNames[role])
        this.addSpawnTask(creepName, { role, home: this.name })
        this.log(`${role}: ${creepName} 发布成功！`, 'success')
    }
}

Room.prototype.removeCreep = function (role, amount = 1) {
    if (role !== 'transporter' && role !== 'worker') return
    for (let i = 0; i < amount; i++) {
        const result = this.removeSpawnTaskByRole(role)
        if (result) continue
        const creepName = Object.keys(Memory.creeps).find(i => Memory.creeps[i].role === role && !Memory.creeps[i].dontNeed)
        if (!creepName) return this.log(`${role}: 别删了，一滴也没有了！`, 'warning')
        Memory.creeps[creepName].dontNeed = true
        this.log(`creep: ${creepName} 已被标记为 dontNeed`, 'notify')
    }
}

Room.prototype.getCreepAmount = function (role) {
    if (role !== 'transporter' && role !== 'worker') return
    let amount = _.filter(Memory.creeps, i => i.role === role).length
    amount += _.filter(this.memory.TaskSpawn, i => i.data && i.data.role === role).length
    return amount
}

Room.prototype.setCreepAmount = function (role, amount) {
    if ((role !== 'transporter' && role !== 'worker') || amount === undefined) return
    const changeAmount = amount - this.getCreepAmount(role)
    if (changeAmount > 0) this.addCreep(role, changeAmount)
    else if (changeAmount < 0) this.removeCreep(role, changeAmount * -1)
}

// Other Role ------------------------------------------------------------------------------------

Room.prototype.addCenterTransporter = function (centerPosX, centerPosY) {
    if (!centerPosX || !centerPosY) this.log('房间未设置中心点，中心爬现在是无头苍蝇。', 'error')
    const role = 'centerTransporter'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name, config: { centerPosX, centerPosY } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addClaimer = function () {
    //
}

Room.prototype.addDefender = function () {
    //
}

Room.prototype.addHarvester = function (flagName) {
    const role = 'harvester'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addHelper = function () {
    //
}

Room.prototype.addMineHarvester = function (flagName) {
    const role = 'mineHarvester'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addRemoteDefender = function () {
    //
}

Room.prototype.addRemoteHarvester = function (flagName) {
    const role = 'remoteHarvester'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addRemoteTransporter = function () {
    //
}

Room.prototype.addReserver = function (flagName) {
    const role = 'reserver'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addUpgrader = function () {
    //
}

function getAvailableCreepName(prefix = 'creep') {
    let count = 1
    while (Memory.allCreeps.includes(prefix + count)) {
        if (count++ > 1000) return prefix + Game.time
    }
    return prefix + count
}
