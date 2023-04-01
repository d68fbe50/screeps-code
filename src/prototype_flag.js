Flag.prototype.run = function () {
    if (this.memory.checked) return
    this.memory.checked = true

    const isInMyRoom = this.room && this.room.my
    const closestMyRoom = isInMyRoom ? this.room : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED) {}
    if (this.color === COLOR_PURPLE) {
        if (this.secondaryColor === COLOR_RED) isInMyRoom && this.room.setCenterPos(this.pos) || this.remove()
        if (this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
        if (this.secondaryColor === COLOR_GREEN) closestMyRoom.addClaimer(this.name)
        if (this.secondaryColor === COLOR_WHITE) delete this.memory.checked && visualLayout(this.pos.roomName, this.pos)
    }
    if (this.color === COLOR_GREEN) {
        if (this.secondaryColor === COLOR_BLUE) isInMyRoom && this.room.setInLab(this.pos) || this.remove()
        if (this.secondaryColor === COLOR_GREEN) removeAvoidRoom(this.pos.roomName) || this.remove()
        if (this.secondaryColor === COLOR_RED) addAvoidRoom(this.pos.roomName) || this.remove()
    }
    if (this.color === COLOR_YELLOW) {
        if (this.secondaryColor === COLOR_BLUE) closestMyRoom.addMineHarvester(this.name)
        if (this.secondaryColor === COLOR_YELLOW) isInMyRoom ? this.room.addHarvester(this.name) : closestMyRoom.addRemoteHarvester(this.name)
        if (this.secondaryColor === COLOR_WHITE) {
            closestMyRoom.addRemoteTask(this.name, 'fromFlag')
            closestMyRoom.setCreepAmount('remoteTransporter',1) // TODO
        }
    }
}

function findClosestMyRoom(fromRoomName) {
    const myRooms = Object.values(Game.rooms).filter(i => i.my)
    return _.sortBy(myRooms, i => Game.map.getRoomLinearDistance(fromRoomName, i.name))[0]
}
