const roleRequires = { // 注意与 config.js 的 ROLE_TYPES 保持一致
    centerTransporter: require('./role_centerTransporter'),
    claimer: require('./role_claimer'),
    defender: require('./role_defender'),
    depoDefender: require('./role_depoDefender'),
    depoHarvester: require('./role_depoHarvester'),
    harvester: require('./role_harvester'),
    helper: require('./role_helper'),
    mineHarvester: require('./role_mineHarvester'),
    powerAttacker: require('./role_powerAttacker'),
    powerDefender: require('./role_powerDefender'),
    powerHealer: require('./role_powerHealer'),
    powerTransporter: require('./role_powerTransporter'),
    remoteHarvester: require('./role_remoteHarvester'),
    remoteDefender: require('./role_remoteDefender'),
    remoteTransporter: require('./role_remoteTransporter'),
    reserver: require('./role_reserver'),
    squadAttacker: require('./role_squadAttacker'),
    squadDismantler: require('./role_squadDismantler'),
    squadHealer: require('./role_squadHealer'),
    squadRanged: require('./role_squadRanged'),
    transporter: require('./role_transporter'),
    worker: require('./role_worker')
}

Creep.prototype.log = function(content, type, notifyNow) {
    this.say(content)
    this.room.log(content, `[${this.pos.x},${this.pos.y}] [${this.name}]`, type, notifyNow)
}

Creep.prototype.run = function() {
    if (this.spawning) return

    const roleRequire = roleRequires[this.memory.role]
    if (!roleRequire) return this.log('no role!', 'error')

    if (!this.memory.ready) {
        if (roleRequire.prepare) this.memory.ready = roleRequire.prepare(this)
        else this.memory.ready = true
    }
    if (!this.memory.ready) return

    const working = roleRequire.source ? this.memory.working : true
    if (working) roleRequire.target && roleRequire.target(this) && (this.memory.working = !this.memory.working)
    else roleRequire.source && roleRequire.source(this) && (this.memory.working = !this.memory.working)
}

Creep.prototype.getFrom = function(target, resourceType = RESOURCE_ENERGY, amount) {
    if (typeof(target) === 'string') target = Game.getObjectById(target)
    if (!target) return ERR_INVALID_TARGET
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target, { range: 1 })
    return result
}

Creep.prototype.putTo = function(target, resourceType = RESOURCE_ENERGY, amount) {
    if (typeof(target) === 'string') target = Game.getObjectById(target)
    if (!target) return ERR_INVALID_TARGET
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target, { range: 1 })
    return result
}

Creep.prototype.upgrade = function(target) {
    if (!target) target = this.room.controller
    const result = this.upgradeController(target)
    if (result === ERR_NOT_IN_RANGE) this.moveTo(target, { range: 3 })
}

module.exports = { roleRequires }
