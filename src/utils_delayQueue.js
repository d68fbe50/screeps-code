const taskCallbacks = {}

function serializeTask(name, data) {
    return `${name} ${JSON.stringify(data)}`
}

function unserializeTask(taskString) {
    const [name, ...tasks] = taskString.split(' ')
    return [name, JSON.parse(tasks.join(' '))]
}

function addDelayTask(name, data, call) {
    Memory.delayTasks.push({ call, data: serializeTask(name, data) })
}

function addDelayCallback(name, callback) {
    taskCallbacks[name] = callback
}

function manageDelayTask() {
    Memory.delayTasks = Memory.delayTasks.filter(task => {
        if (Game.time < task.call) return true

        const [taskName, taskData] = unserializeTask(task.data);
        if (!(taskName in taskCallbacks)) return true

        taskCallbacks[taskName](Game.rooms[taskData.roomName], taskData)

        return false
    })
}

module.exports = { addDelayTask, addDelayCallback, manageDelayTask }
