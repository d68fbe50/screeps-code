Flag.prototype.run = function () {
    if (this.memory.checked) return
    this.memory.checked = true

    const isInMyRoom = this.room && this.room.my
    const closestMyRoom = isInMyRoom ? this.room : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED) {
        if (this.secondaryColor === COLOR_RED) ;
        if (this.secondaryColor === COLOR_PURPLE) ;
        if (this.secondaryColor === COLOR_BLUE) ;
        if (this.secondaryColor === COLOR_GREEN) ;
        if (this.secondaryColor === COLOR_YELLOW) ;
        if (this.secondaryColor === COLOR_WHITE) ;
    }
    if (this.color === COLOR_PURPLE) {
        if (this.secondaryColor === COLOR_RED) isInMyRoom && this.room.setCenterPos(this.pos.x, this.pos.y) || this.remove()
        if (this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
        if (this.secondaryColor === COLOR_GREEN) closestMyRoom.addClaimer(this.name)
        if (this.secondaryColor === COLOR_WHITE) delete this.memory.checked && visualLayout(this.pos.roomName, this.pos.x, this.pos.y)
    }
    if (this.color === COLOR_GREEN) {
        if (this.secondaryColor === COLOR_GREEN) removeAvoidRoom(this.pos.roomName) || this.remove()
        if (this.secondaryColor === COLOR_RED) addAvoidRoom(this.pos.roomName) || this.remove()
    }
    if (this.color === COLOR_YELLOW) {
        if (this.secondaryColor === COLOR_RED) ; // powerBank
        if (this.secondaryColor === COLOR_BLUE) closestMyRoom.addMineHarvester(this.name)
        if (this.secondaryColor === COLOR_GREEN) ; // deposit
        if (this.secondaryColor === COLOR_YELLOW) isInMyRoom ? this.room.addHarvester(this.name) : closestMyRoom.addRemoteHarvester(this.name)
        if (this.secondaryColor === COLOR_WHITE) {
            closestMyRoom.addRemoteTask(this.name, 'fromFlag')
            closestMyRoom.addRemoteTransporter()
        }
    }
}

function findClosestMyRoom(fromRoomName) {
    const myRoomNames = Object.keys(Game.rooms).filter(i => Game.rooms[i] && Game.rooms[i].my)
    const roomName = _.sortBy(myRoomNames, i => Game.map.getRoomLinearDistance(fromRoomName, i))[0]
    return Game.rooms[roomName]
}
