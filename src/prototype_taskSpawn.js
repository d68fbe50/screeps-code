const { ROLE_TYPES } = require('./config')

Room.prototype.getSpawnTask = function(roleType) {
    if (!(roleType in ROLE_TYPES)) return false
    return this.getTask('TaskSpawn', roleType)
}

Room.prototype.addSpawnTask = function(roleType, priority, amount) {
    if (!(roleType in ROLE_TYPES)) return false
    const taskData = { amount }
    return this.addTask('TaskSpawn', roleType, priority, taskData)
}

Room.prototype.removeSpawnTask = function(roleType) {
    if (!(roleType in ROLE_TYPES)) return false
    return this.removeTask('TaskSpawn', roleType)
}

Room.prototype.updateSpawnTask = function(roleType, priority, amount) {
    if (!(roleType in ROLE_TYPES)) return false
    const taskData = { amount }
    return this.updateTask('TaskSpawn', roleType, priority, taskData)
}
