const { WORK_TYPES } = require('./config')

Room.prototype.getWorkTask = function(workType) {
    if (!(workType in WORK_TYPES)) return false
    return this.getTask('TaskWork', workType)
}

Room.prototype.addWorkTask = function(workType, priority, needAmount, workingAmount) {
    console.log(JSON.stringify(WORK_TYPES))
    console.log(workType)
    if (!(workType in WORK_TYPES)) return false
    const taskData = { needAmount, workingAmount }
    return this.addTask('TaskWork', workType, priority, taskData)
}

Room.prototype.removeWorkTask = function(workType) {
    if (!(workType in WORK_TYPES)) return false
    return this.removeTask('TaskWork', workType)
}

Room.prototype.updateWorkTask = function(workType, priority, needAmount, workingAmount) {
    if (!(workType in WORK_TYPES)) return false
    const taskData = { needAmount, workingAmount }
    return this.updateTask('TaskWork', workType, priority, taskData)
}
