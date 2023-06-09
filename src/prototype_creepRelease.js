const mount_role = require('./role')

const taskRoles = ['remoteTransporter', 'transporter', 'worker', 'upgrader']

Room.prototype.creepDynamicAdjust = function () {
    if (!this.memory.isDynamicAdjust) return // TODO
    if (Game.time % 100) return
    if (this.storage) {
        //
    }
    if (this.level === 8) return this.setCreepAmount('upgrader', 1)
}

Room.prototype.getCreepAmount = function (role) {
    if (!taskRoles.includes(role)) return
    let amount = _.filter(Memory.creeps, i => i.home === this.name && i.role === role && !i.dontNeed).length
    amount += _.filter(this.memory.TaskSpawn, i => i.data && i.data.role === role).length
    this.memory[role + 'Amount'] = amount
    return amount
}

Room.prototype.setCreepAmount = function (role, amount) {
    if (!taskRoles.includes(role) || amount === undefined) return
    const changeAmount = amount - this.getCreepAmount(role)
    if (changeAmount > 0) addCreep(this, role, changeAmount)
    else if (changeAmount < 0) removeCreep(this, role, changeAmount * -1)
    this.memory[role + 'Amount'] = amount
}

Room.prototype.sett = function (amount) {
    return this.setCreepAmount('transporter', amount)
}

Room.prototype.setu = function (amount) {
    return this.setCreepAmount('upgrader', amount)
}

Room.prototype.setw = function (amount) {
    return this.setCreepAmount('worker', amount)
}

Room.prototype.addCenterTransporter = function () {
    const role = 'centerTransporter'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addClaimer = function (flagName) {
    const role = 'claimer'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addHarvester = function (flagName) {
    const role = 'harvester'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addHelper = function (flagName) {
    const role = 'helper'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addMineHarvester = function () {
    const role = 'mineHarvester'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addRemoteHarvester = function (flagName) {
    const role = 'remoteHarvester'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addRemoteTransporter = function () {
    const role = 'remoteTransporter'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addReserver = function (flagName) {
    const role = 'reserver'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

function getAvailableCreepName(prefix = 'creep') {
    let count = 1
    while (Memory.allCreeps.includes(prefix + count)) {
        if (count++ > 1000) return prefix + Game.time
    }
    return prefix + count
}

function addCreep (room, role, amount = 1) {
    if (!taskRoles.includes(role)) return
    for (let i = 0; i < amount; i++) {
        const dontNeedName = _.findLastKey(Memory.creeps, i => i.home === room.name && i.role === role && i.dontNeed)
        if (dontNeedName) {
            delete Memory.creeps[dontNeedName].dontNeed
            room.log(`creep: ${dontNeedName} 已取消 dontNeed 标记`)
            continue
        }
        const creepName = getAvailableCreepName(mount_role[role].shortName)
        room.addSpawnTask(creepName, { role, home: room.name })
        room.log(`${role}: ${creepName} 发布成功！`)
    }
}

function removeCreep (room, role, amount = 1) {
    if (!taskRoles.includes(role)) return
    for (let i = 0; i < amount; i++) {
        const result = room.removeSpawnTaskByRole(role)
        if (result) continue
        const creepName = _.findKey(Memory.creeps, i => i.home === room.name && i.role === role && !i.dontNeed)
        if (!creepName) return room.log(`${role}: 别删了，一滴也没有了！`, 'warning')
        Memory.creeps[creepName].dontNeed = true
        room.log(`creep: ${creepName} 已被标记为 dontNeed`)
    }
}
