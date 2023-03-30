const mount_role = require('./roles')

// =================================================================================================== transporter & worker & upgrader

const taskRoles = ['remoteTransporter', 'transporter', 'worker', 'upgrader']

Room.prototype.addCreep = function (role, amount = 1) {
    if (!taskRoles.includes(role)) return
    for (let i = 0; i < amount; i++) {
        const dontNeedName = _.findKey(Memory.creeps, i => i.home === this.name && i.role === role && i.dontNeed)
        if (dontNeedName) {
            Memory.creeps[dontNeedName].dontNeed = undefined
            this.log(`creep: ${dontNeedName} 已取消 dontNeed 标记`)
            continue
        }
        const creepName = getAvailableCreepName(mount_role[role].shortName)
        this.addSpawnTask(creepName, { role, home: this.name })
        this.log(`${role}: ${creepName} 发布成功！`)
    }
}

Room.prototype.removeCreep = function (role, amount = 1) {
    if (!taskRoles.includes(role)) return
    for (let i = 0; i < amount; i++) {
        const result = this.removeSpawnTaskByRole(role)
        if (result) continue
        const creepName = _.findKey(Memory.creeps, i => i.home === this.name && i.role === role && !i.dontNeed)
        if (!creepName) return this.log(`${role}: 别删了，一滴也没有了！`, 'warning')
        Memory.creeps[creepName].dontNeed = true
        this.log(`creep: ${creepName} 已被标记为 dontNeed`)
    }
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
    if (changeAmount > 0) this.addCreep(role, changeAmount)
    else if (changeAmount < 0) this.removeCreep(role, changeAmount * -1)
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

// =================================================================================================== Other Roles

Room.prototype.addCenterTransporter = function (centerPosX, centerPosY) {
    if (!centerPosX || !centerPosY) this.log('房间未设置中心点，中心爬现在是无头苍蝇', 'warning')
    const role = 'centerTransporter'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { centerPosX, centerPosY } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addClaimer = function (flagName) {
    const role = 'claimer'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
    this.log(`${role}: ${creepName} 发布成功！`)
}

Room.prototype.addDefender = function () {
    //
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

Room.prototype.addMineHarvester = function (flagName) {
    const role = 'mineHarvester'
    const creepName = getAvailableCreepName(mount_role[role].shortName)
    this.addSpawnTask(creepName, { role, home: this.name, config: { flagName } })
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
