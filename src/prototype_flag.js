Flag.prototype.run = function () {
    if (this.memory.checked) return
    this.memory.checked = true

    const isInMyRoom = this.room && this.room.my
    const closestMyRoom = isInMyRoom ? this.room : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED && this.secondaryColor === COLOR_RED) {}
    else if (this.color === COLOR_PURPLE && this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
    else if (this.color === COLOR_YELLOW && this.secondaryColor === COLOR_YELLOW) isInMyRoom ? this.room.addHarvester(this.name) : closestMyRoom.addRemoteHarvester(this.name)

    const command = this.name.split('-')[0]
    if (command === 'addAvoid') addAvoidRoom(this.pos.roomName) || this.remove()
    else if (command === 'removeAvoid') addAvoidRoom(this.pos.roomName) || this.remove()
    else if (command === 'centerPos') isInMyRoom && this.room.setCenterPos(this.pos) || this.remove()
    else if (command === 'claim') closestMyRoom.addClaimer(this.name)
    else if (command === 'inLab') isInMyRoom && this.room.setInLab(this.pos) || this.remove()
    else if (command === 'remote') closestMyRoom.addRemoteTask(this.name, 'fromFlag')
    else if (command === 'visual') delete this.memory.checked && visualLayout(this.pos.roomName, this.pos)
}

function findClosestMyRoom(fromRoomName) {
    const myRooms = Object.values(Game.rooms).filter(i => i.my)
    return _.sortBy(myRooms, i => Game.map.getRoomLinearDistance(fromRoomName, i.name))[0]
}
