const { ROLE_TYPES } = require('./config')

Room.prototype.getSpawnTask = function(creepName) {
    return this.getTask('TaskSpawn', creepName)
}

Room.prototype.addSpawnTask = function(creepName, priority, creepMemory) {
    if (!creepMemory || !(creepMemory.role in ROLE_TYPES)) return false
    return this.addTask('TaskSpawn', creepName, priority, creepMemory)
}

Room.prototype.removeSpawnTask = function(creepName) {
    return this.removeTask('TaskSpawn', creepName)
}

Room.prototype.updateSpawnTask = function(creepName, priority, creepMemory) {
    return this.updateTask('TaskSpawn', creepName, priority, creepMemory)
}
