const resourcesExpectAmount = {
    'OH': 2000, 'ZK': 2000, 'UL': 2000, 'G': 2000,
    'UH': 2000, 'UH2O': 2000, 'XUH2O': 10000, // attack
    'ZO': 2000, 'ZHO2': 2000, 'XZHO2': 10000, // move
    'LH': 2000, 'LH2O': 2000, 'XLH2O': 10000, // repair
    'LO': 2000, 'LHO2': 2000, 'XLHO2': 10000, // heal
    'KO': 2000, 'KHO2': 2000, 'XKHO2': 10000, // ranged
    'ZH': 2000, 'ZH2O': 2000, 'XZH2O': 10000, // dismantle
    'GO': 2000, 'GHO2': 2000, 'XGHO2': 10000, // tough
    'UO': 2000, 'UHO2': 2000, 'XUHO2': 5000, // harvest
    'KH': 2000, 'KH2O': 2000, 'XKH2O': 5000, // carry
    'GH': 2000, 'GH2O': 2000, 'XGH2O': 5000, // upgrade
}

StructureLab.prototype.run = function () {
    if (!this.room.terminal || !this.room.inLab1 || !this.room.inLab2) return
    if (!this.room.memory.labs[this.id]) this.room.memory.labs[this.id] = 'reaction'

    if (this.energy < this.store.getCapacity(RESOURCE_ENERGY) / 2) this.room.addTransportTask('labEnergy')

    if (this.room.memory.labs[this.id] === 'inLab1' || this.room.memory.labs[this.id] === 'inLab2') runInLab(this)
    else if (this.room.memory.labs[this.id] === 'reaction') runReactionLab(this)
    else runBoostLab(this)
}

function runInLab(lab) {
    if (Game.time % 10) return
    if (!lab.room.inLab1.isEmpty && !lab.room.inLab2.isEmpty) return
    if (lab.room._hasRunInLab) return
    lab.room._hasRunInLab = true
    if (lab.room.getTransportTask('labReactionOut') || lab.room.getTransportTask('labReactionIn')) return
    if ([lab.room.inLab1, lab.room.inLab2, ...lab.room.reactionLabs].find(i => !i.isEmpty)) return lab.room.addTransportTask('labReactionOut')
    if (chooseReactionType(lab.room)) lab.room.addTransportTask('labReactionIn')
}

function runReactionLab(lab) {
    if (lab.cooldown > 0 || lab.room.inLab1.isEmpty || lab.room.inLab2.isEmpty) return
    lab.runReaction(lab.room.inLab1, lab.room.inLab2)
}

function runBoostLab(lab) {
    if (lab.room.getTransportTask('labBoostOut') || lab.room.getTransportTask('labBoostIn')) return
    if (!lab.isEmpty && lab.mineralType !== lab.boostType) return lab.room.addTransportTask('labBoostOut')
    if (lab.isEmpty || (lab.mineralType === lab.boostType && lab.store[lab.mineralType] < lab.capacity / 2)) {
        if (lab.room.terminal.store[lab.boostType] >= lab.capacity / 2) return lab.room.addTransportTask('labBoostIn')
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

Object.defineProperty(Room.prototype, 'inLab1', {
    get() {
        if (!this._hasAccessInLab1) {
            this._hasAccessInLab1 = true
            this._inLab1 = this.lab.find(i => this.memory.labs[i.id] === 'inLab1')
        }
        return this._inLab1
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'inLab2', {
    get() {
        if (!this._hasAccessInLab2) {
            this._hasAccessInLab2 = true
            this._inLab2 = this.lab.find(i => this.memory.labs[i.id] === 'inLab2')
        }
        return this._inLab2
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'boostLabs', {
    get() {
        if (!this._hasAccessBoostLabs) {
            this._hasAccessBoostLabs = true
            this._boostLabs = this.lab.filter(i => this.memory.labs[i.id]
                && this.memory.labs[i.id] !== 'inLab1'
                && this.memory.labs[i.id] !== 'inLab2'
                && this.memory.labs[i.id] !== 'reaction')
        }
        return this._boostLabs
    },
    configurable: true
})

Object.defineProperty(Room.prototype, 'reactionLabs', {
    get() {
        if (!this._hasAccessReactionLabs) {
            this._hasAccessReactionLabs = true
            this._reactionLabs = this.lab.filter(i => this.memory.labs[i.id] === 'reaction')
        }
        return this._reactionLabs
    },
    configurable: true
})

Object.defineProperty(StructureLab.prototype, 'boostType', {
    get() {
        return this.room.memory.labs[this.id]
    },
    configurable: true
})

function chooseReactionType (room) {
    const resourceType = Object.keys(resourcesExpectAmount).find(i => room.terminal.store[i] < resourcesExpectAmount[i]) || 'XGH2O'
    const [ source1, source2 ] = reactionSourceMap[resourceType]
    if (room.terminal.store[source1] < LAB_MINERAL_CAPACITY / 2 || room.terminal.store[source2] < LAB_MINERAL_CAPACITY / 2) return false
    room.memory.labs.source1 = source1
    room.memory.labs.source2 = source2
    return true
}

const reactionSourceMap = {
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
