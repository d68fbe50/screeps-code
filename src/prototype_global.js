Object.values(Game.rooms).forEach(i => i.controller && i.controller.my && (global[i.name.toLowerCase()] = i))

global.log = function(content, prefix = '', type = 'info') {
    if (type === 'error') content = `<text style="color:red">${content}</text>`
    if (type === 'warning') content = `<text style="color:yellow">${content}</text>`
    console.log(prefix + ' ' + content)
}
