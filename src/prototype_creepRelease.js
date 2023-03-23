const roleShortNames = {
    centerTransporter: 't',
    claimer: 'c',
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
    transporter: 't',
    worker: 'w'
}

Room.prototype.addCenterTransporter = function (centerPosX, centerPosY) {
    if (!centerPosX || !centerPosY) this.log('房间未设置中心点，中心爬现在是无头苍蝇。', 'error')
    const role = 'centerTransporter'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, undefined, { role, home: this.name, config: { centerPosX, centerPosY } })
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
    this.addSpawnTask(creepName, undefined, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addHelper = function () {
    //
}

Room.prototype.addMineHarvester = function (flagName) {
    const role = 'mineHarvester'
    const creepName = getAvailableCreepName(roleShortNames[role])
    this.addSpawnTask(creepName, undefined, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addRemoteDefender = function () {
    //
}

Room.prototype.addRemoteHarvester = function () {
    //
}

Room.prototype.addRemoteTransporter = function () {
    //
}

Room.prototype.addReserver = function () {
    //
}

Room.prototype.addTransporter = function () {
    //
}

Room.prototype.addWorker = function () {
    //
}

function getAvailableCreepName(prefix) {
    let count = 1
    while (Memory.allCreepNames.includes(prefix + count)) {
        if (count++ > 1000) return prefix + Game.time
    }
    return prefix + count
}
