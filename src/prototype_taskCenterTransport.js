const { SUBMIT_STRUCTURE_TYPES } = require('./config')

Room.prototype.getCenterTask = function(submitStructureType) {
    return this.getTask('TaskCenterTransport', submitStructureType)
}

Room.prototype.addCenterTask = function(submitStructureType, priority, sourceStructureType, targetStructureType, resourceType, amount) {
    if (!(submitStructureType in SUBMIT_STRUCTURE_TYPES)) return false
    const taskData = { sourceStructureType, targetStructureType, resourceType, amount }
    return this.addTask('TaskCenterTransport', submitStructureType, priority, taskData)
}

Room.prototype.removeCenterTask = function(submitStructureType) {
    return this.removeTask('TaskCenterTransport', submitStructureType)
}

Room.prototype.updateCenterTask = function(submitStructureType, priority, taskData) {
    return this.updateTask('TaskCenterTransport', submitStructureType, priority, taskData)
}
