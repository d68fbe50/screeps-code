StructureStorage.prototype.run = function () {
    if (this.store.getFreeCapacity() < 100000) this.log('快满了，尽快处理！', 'warning', true)
}
