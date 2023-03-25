Flag.prototype.run = function () {
    if (this.memory.checked) return
    const isInMyRoom = this.room && this.room.my
    const closestMyRoom = isInMyRoom ? this.room : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED) { // attack
        if (this.secondaryColor === COLOR_RED) ;
        if (this.secondaryColor === COLOR_PURPLE) ;
        if (this.secondaryColor === COLOR_BLUE) ;
        if (this.secondaryColor === COLOR_GREEN) ;
        if (this.secondaryColor === COLOR_YELLOW) ;
        if (this.secondaryColor === COLOR_ORANGE) ;
        if (this.secondaryColor === COLOR_WHITE) ;
    }
    if (this.color === COLOR_PURPLE) { // claim & reserve
        if (this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
        if (this.secondaryColor === COLOR_GREEN) closestMyRoom.addClaimer(this.name)
    }
    if (this.color === COLOR_BLUE) { // defend
        if (this.secondaryColor === COLOR_RED); // powerBank defend
        if (this.secondaryColor === COLOR_PURPLE); // remote defend
        if (this.secondaryColor === COLOR_BLUE) ; // home defend
        if (this.secondaryColor === COLOR_ORANGE) ; // deposit defend
    }
    if (this.color === COLOR_YELLOW) { // source & mineral & powerBank & deposit
        if (this.secondaryColor === COLOR_RED); // powerBank
        if (this.secondaryColor === COLOR_BLUE) closestMyRoom.addMineHarvester(this.name)
        if (this.secondaryColor === COLOR_YELLOW) isInMyRoom ? this.room.addHarvester(this.name) : closestMyRoom.addRemoteHarvester(this.name)
        if (this.secondaryColor === COLOR_ORANGE) ; // deposit
        if (this.secondaryColor === COLOR_WHITE) ; // steal
    }
    if (this.color === COLOR_ORANGE) { // emergency
        if (this.secondaryColor === COLOR_RED) ; // nuker emergency
    }
    if (this.color === COLOR_WHITE) { // command
        if (this.secondaryColor === COLOR_BLUE) isInMyRoom && this.room.setCenterPos(this.pos.x, this.pos.y) || this.remove()
    }

    this.memory.checked = true
}

function findClosestMyRoom(fromRoomName) {
    const myRoomNameList = Object.keys(Game.rooms).filter(r => r.my)
    const roomName = _.sortBy(myRoomNameList, r => Game.market.calcTransactionCost(1000, fromRoomName, r))[0]
    return Game.rooms[roomName]
}
