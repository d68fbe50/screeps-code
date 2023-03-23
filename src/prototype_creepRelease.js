Room.prototype.addCenterTransporter = function () {
    //
}

Room.prototype.addClaimer = function () {
    //
}

Room.prototype.addDefender = function () {
    //
}

Room.prototype.addHarvester = function (flagName) {
    const creepName = getAvailableCreepName('h')
    this.addSpawnTask(creepName, undefined, { role: 'harvester', home: this.name, config: { flagName } })
    this.log(`harvester: ${creepName} 发布成功！`, 'success')
}

Room.prototype.addHelper = function () {
    //
}

Room.prototype.addMineHarvester = function () {
    //
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
    while (Memory.allCreepNames.includes('' + prefix + count)) {
        if (count > 1000) return '' + prefix + Game.time
        count++
    }
    return '' + prefix + count
}
