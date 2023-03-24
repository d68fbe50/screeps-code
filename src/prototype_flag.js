Flag.prototype.run = function () {
    if (this.memory.checked) return
    const isInMyRoom = this.room && this.room.my
    const closestMyRoom = isInMyRoom ? this.room : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED) {
        if (this.secondaryColor === COLOR_RED) ;
        if (this.secondaryColor === COLOR_PURPLE) ;
        if (this.secondaryColor === COLOR_BLUE) ;
        if (this.secondaryColor === COLOR_CYAN) ;
        if (this.secondaryColor === COLOR_GREEN) ;
        if (this.secondaryColor === COLOR_YELLOW) ;
        if (this.secondaryColor === COLOR_ORANGE) ;
        if (this.secondaryColor === COLOR_BROWN) ;
        if (this.secondaryColor === COLOR_GREY) ;
        if (this.secondaryColor === COLOR_WHITE) ;
    }
    if (this.color === COLOR_PURPLE) {
        if (this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
    }
    if (this.color === COLOR_YELLOW) {
        if (this.secondaryColor === COLOR_CYAN) closestMyRoom.addMineHarvester(this.name)
        if (this.secondaryColor === COLOR_YELLOW) isInMyRoom ? this.room.addHarvester(this.name) : closestMyRoom.addRemoteHarvester(this.name)
    }
    if (this.color === COLOR_WHITE) {
        if (this.secondaryColor === COLOR_BLUE) isInMyRoom && this.room.setCenterPos(this.pos.x, this.pos.y) || this.remove()
    }

    this.memory.checked = true
}

function findClosestMyRoom(fromRoomName) {
    const myRoomNameList = Object.keys(Game.rooms).filter(i => i.my)
    const roomName = _.sortBy(myRoomNameList, i => Game.market.calcTransactionCost(1000, fromRoomName, i))[0]
    return Game.rooms[roomName]
}
