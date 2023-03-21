Room.prototype.log = function(content, prefix, type) {
    prefix = `<a href="https://screeps.com/a/#!/room/${Game.shard.name}/${this.name}">[${this.name}]</a> ${prefix}`
    global.log(content, prefix, type)
}
