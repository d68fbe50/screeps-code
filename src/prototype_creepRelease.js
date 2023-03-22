Room.prototype.addHarvester = function () {
    const sources = this.find(FIND_SOURCES)
    const creepNames = []
    if (sources[0]) {
        const name = `${this.name}_harvester_${1}`
        const config = { sourceId: sources[0].id }
        this.addSpawnTask(name, undefined, { role: 'harvester', home: this.name, config })
        creepNames.push(name)
    }
    if (sources[1]) {
        const name = `${this.name}_harvester_${2}`
        const config = { sourceId: sources[1].id }
        this.addSpawnTask(name, undefined, { role: 'harvester', home: this.name, config })
        creepNames.push(name)
    }
    this.log(`harvester*${sources.length} 发布成功！`, creepNames, 'success')
}
