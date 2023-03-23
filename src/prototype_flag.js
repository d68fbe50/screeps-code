Flag.prototype.run = function () {
    if (this.memory.checked) return
    const flagRoom = Game.rooms[this.pos.roomName]
    const isInMyRoom = flagRoom.controller && flagRoom.controller.my
    const closestMyRoom = isInMyRoom ? flagRoom : findClosestMyRoom(this.pos.roomName)

    if (this.color === COLOR_RED) {
        if (this.secondaryColor === COLOR_RED) ;
        else if (this.secondaryColor === COLOR_PURPLE) ;
        else if (this.secondaryColor === COLOR_BLUE) ;
        else if (this.secondaryColor === COLOR_CYAN) ;
        else if (this.secondaryColor === COLOR_GREEN) ;
        else if (this.secondaryColor === COLOR_YELLOW) ;
        else if (this.secondaryColor === COLOR_ORANGE) ;
        else if (this.secondaryColor === COLOR_BROWN) ;
        else if (this.secondaryColor === COLOR_GREY) ;
        else if (this.secondaryColor === COLOR_WHITE) ;
    } else if (this.color === COLOR_PURPLE) {
        if (this.secondaryColor === COLOR_PURPLE) closestMyRoom.addReserver(this.name)
    } else if (this.color === COLOR_YELLOW) {
        if (this.secondaryColor === COLOR_YELLOW) closestMyRoom.addHarvester(this.name)
    }

    this.memory.checked = true
}

function findClosestMyRoom(fromRoomName) {
    const myRoomNames = Object.keys(Game.rooms).filter(i => i.controller && i.controller.my)
    const sortedMyRoomNames = _.sortBy(myRoomNames, i => Game.market.calcTransactionCost(1000, fromRoomName, i))
    return sortedMyRoomNames[0] && Game.rooms[sortedMyRoomNames[0]]
}
