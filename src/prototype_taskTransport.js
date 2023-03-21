const { TRANSPORT_TYPES } = require('./config')

Room.prototype.getTransportTask = function(transportType) {
    if (!(transportType in TRANSPORT_TYPES)) return false
    return this.getTask('TaskTransport', transportType)
}

Room.prototype.addTransportTask = function(transportType, priority) {
    if (!(transportType in TRANSPORT_TYPES)) return false
    const taskData = {}
    return this.addTask('TaskTransport', transportType, priority, taskData)
}

Room.prototype.removeTransportTask = function(transportType) {
    if (!(transportType in TRANSPORT_TYPES)) return false
    return this.removeTask('TaskTransport', transportType)
}

Room.prototype.updateTransportTask = function(transportType, priority) {
    if (!(transportType in TRANSPORT_TYPES)) return false
    const taskData = {}
    return this.updateTask('TaskTransport', transportType, priority, taskData)
}
