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

Room.prototype.addTransporter = function () {
    const role = 'transporter'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addUpgrader = function () {
    //
}

Room.prototype.addWorker = function () {
    const role = 'worker'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, { role, home: this.name })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

function getAvailableCreepName(prefix = 'creep') {
    let count = 1
    while (Memory.allCreepNameList.includes(prefix + count)) {
        if (count++ > 1000) return prefix + Game.time
    }
    return prefix + count
}
