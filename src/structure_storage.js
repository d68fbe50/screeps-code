StructureStorage.prototype.run = function () {
    //
}

StructureStorage.prototype.onBuildComplete = function () {
    this.room.setCreepAmount('worker', 3)
    this.log('已建成', 'success')
}
