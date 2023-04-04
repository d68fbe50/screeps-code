const expectAmount = {
    'OH': 1500, 'ZK': 1500, 'UL': 1500, 'G': 1500,
    'UH': 1500, 'UH2O': 1500, 'XUH2O': 10000, // attack
    'ZO': 1500, 'ZHO2': 1500, 'XZHO2': 10000, // move
    'LH': 1500, 'LH2O': 1500, 'XLH2O': 10000, // repair
    'LO': 1500, 'LHO2': 1500, 'XLHO2': 10000, // heal
    'KO': 1500, 'KHO2': 1500, 'XKHO2': 10000, // ranged
    'ZH': 1500, 'ZH2O': 1500, 'XZH2O': 10000, // dismantle
    'GO': 1500, 'GHO2': 1500, 'XGHO2': 10000, // tough
    'UO': 1500, 'UHO2': 1500, 'XUHO2': 5000, // harvest
    'KH': 1500, 'KH2O': 1500, 'XKH2O': 5000, // carry
    'GH': 1500, 'GH2O': 1500, 'XGH2O': 5000, // upgrade
}

StructureLab.prototype.run = function () {
    if (!this.room.inLab1 || !this.room.inLab2) return
    if (!this.room.memory.labs[this.id]) this.room.memory.labs[this.id] = 'reaction'

    if (this.energy < this.store.getCapacity(energy) / 2) this.room.addTransportTask('labEnergy')

    if (this.room.memory.labs[this.id] === 'inLab1' || this.room.memory.labs[this.id] === 'inLab2') {
        if (Game.time % 30) return
        if (!this.room.inLab1.isEmpty && !this.room.inLab2.isEmpty) return
        if (this.room._hasRunInLab) return
        this.room._hasRunInLab = true
        if (this.room.getTransportTask('labReactionOut') || this.room.getTransportTask('labReactionIn')) return
        if ([this.room.inLab1, this.room.inLab2, ...this.room.reactionLabs].find(i => !i.isEmpty)) return this.room.addTransportTask('labReactionOut')
        if (chooseReactionType(this.room)) this.room.addTransportTask('labReactionIn')
    }

    else if (this.room.memory.labs[this.id] === 'reaction') {
        if (this.cooldown > 0 || this.room.inLab1.isEmpty || this.room.inLab2.isEmpty) return
        this.runReaction(this.room.inLab1, this.room.inLab2)
    }

    else {
        if (this.room.getTransportTask('labBoostOut') || this.room.getTransportTask('labBoostIn')) return
        if (!this.isEmpty && this.mineralType !== this.boostType) return this.room.addTransportTask('labBoostOut')
        if (this.isEmpty || (this.mineralType === this.boostType && this.store[this.mineralType] < LAB_MINERAL_CAPACITY / 2)) {
            if (this.room.getResources(this.boostType, LAB_MINERAL_CAPACITY / 2)) return this.room.addTransportTask('labBoostIn')
        }
    }
}

Room.prototype.setInLab = function (pos) {
    const lab = pos.lookForStructure(STRUCTURE_LAB)
    if (!lab) return
    const hasInLab1 = !!this.inLab1
    hasInLab1 ? (this.memory.labs[lab.id] = 'inLab2') : (this.memory.labs[lab.id] = 'inLab1')
    this.log(`inLab${hasInLab1 ? 2 : 1} 已设置在 [${pos.x},${pos.y}]`)
}

StructureLab.prototype.onBoost = function (boostType) {
    if (this.store[boostType] === undefined) return
    this.room.memory.labs[this.id] = boostType
}

StructureLab.prototype.offBoost = function () {
    this.room.memory.labs[this.id] = 'reaction'
}

Object.defineProperty(StructureLab.prototype, 'boostType', {
    get() {
        return this.room.memory.labs[this.id]
    },
    configurable: true
})

function chooseReactionType (room) {
    const resourceType = Object.keys(expectAmount).find(i =>
        !room.getResources(i, expectAmount[i])
        && room.getResources(reactionMap[i][0], LAB_MINERAL_CAPACITY / 2)
        && room.getResources(reactionMap[i][1], LAB_MINERAL_CAPACITY / 2)
    )
    if (!resourceType) return
    const [ source1, source2 ] = reactionMap[resourceType]
    room.memory.labs.source1 = source1
    room.memory.labs.source2 = source2
    return true
}

const reactionMap = {
    'OH': ['O', 'H'], 'ZK': ['Z', 'K'], 'UL': ['U', 'L'], 'G': ['ZK', 'UL'],
    'ZO': ['Z', 'O'], 'ZH': ['Z', 'H'],
    'KO': ['K', 'O'], 'KH': ['K', 'H'],
    'UO': ['U', 'O'], 'UH': ['U', 'H'],
    'LO': ['L', 'O'], 'LH': ['L', 'H'],
    'GO': ['G', 'O'], 'GH': ['G', 'H'],
    'ZHO2': ['ZO', 'OH'], 'ZH2O': ['ZH', 'OH'],
    'KHO2': ['KO', 'OH'], 'KH2O': ['KH', 'OH'],
    'UHO2': ['UO', 'OH'], 'UH2O': ['UH', 'OH'],
    'LHO2': ['LO', 'OH'], 'LH2O': ['LH', 'OH'],
    'GHO2': ['GO', 'OH'], 'GH2O': ['GH', 'OH'],
    'XZHO2': ['X', 'ZHO2'], 'XZH2O': ['X', 'ZH2O'],
    'XKHO2': ['X', 'KHO2'], 'XKH2O': ['X', 'KH2O'],
    'XUHO2': ['X', 'UHO2'], 'XUH2O': ['X', 'UH2O'],
    'XLHO2': ['X', 'LHO2'], 'XLH2O': ['X', 'LH2O'],
    'XGHO2': ['X', 'GHO2'], 'XGH2O': ['X', 'GH2O']
}
