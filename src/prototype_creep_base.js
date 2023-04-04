Creep.prototype.buildTo = function (target) {
    const result = this.build(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target) || this.repairRoad()
    return result
}

Creep.prototype.claim = function (target) {
    if (!target) target = this.room.controller
    const result = this.claimController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.dismantleTo = function (target) {
    const result = this.dismantle(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.getFrom = function (target, resourceType = energy, amount) {
    let result
    if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, resourceType, amount)
    else if (target instanceof Resource) result = this.pickup(target)
    else result = this.harvest(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.goto = function (firstArg, secondArg, opts) {
    const toPos = (typeof firstArg == 'object') ? (firstArg.pos || firstArg) : new RoomPosition(firstArg, secondArg, this.room.name)
    if (this.room.name === toPos.roomName) this.room.visual.line(this.pos, toPos, { width: 0.05 })
    this.moveTo(firstArg, secondArg, opts)
}

Creep.prototype.putTo = function (target, resourceType = energy, amount) {
    const result = this.transfer(target, resourceType, amount)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.repairTo = function (target) {
    const result = this.repair(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target) || this.repairRoad()
    return result
}

Creep.prototype.reserve = function (target) {
    if (!target) target = this.room.controller
    const result = this.reserveController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target)
    return result
}

Creep.prototype.upgrade = function (target) {
    if (!target) target = this.room.controller
    const result = this.upgradeController(target)
    if (result === ERR_NOT_IN_RANGE) this.goto(target, {range: 3}) || this.repairRoad()
    return result
}
