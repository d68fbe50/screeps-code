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
    if (!this.room.inLab1 || !this.room.inLab2) return
    if (!this.room.memory.labs[this.id]) this.room.memory.labs[this.id] = 'reaction'

    if (this.energy < this.store.getCapacity(RESOURCE_ENERGY) / 2) this.room.addTransportTask('labEnergy')

    if (this.room.memory.labs[this.id] === 'inLab1' || this.room.memory.labs[this.id] === 'inLab2') runInLab(this)
    else if (this.room.memory.labs[this.id] === 'reaction') runReactionLab(this)
    else runBoostLab(this)
}

StructureLab.prototype.onBuildComplete = function () {
    if (!this.room.inLab1 || !this.room.inLab2) this.room.log('请插[绿蓝]旗子初始化输入 lab', 'warning')
}

function runInLab(lab) {
    if (lab.room._hasRunInLab) return
    lab.room._hasRunInLab = true

    if (lab.room.inLab1.isEmpty || lab.room.inLab2.isEmpty) {
        // lab.room.addTransportTask('labReactionOut')
        // lab.room.addTransportTask('labReactionIn')
    }
}

function runReactionLab(lab) {
    if (lab.cooldown > 0 || lab.room.inLab1.isEmpty || lab.room.inLab2.isEmpty) return
    const result = lab.runReaction(lab.room.inLab1, lab.room.inLab2)
    // if (result === ERR_INVALID_ARGS) lab.room.addTransportTask('labReactionOut')
}

function runBoostLab(lab) {
    if (lab.mineralType && lab.mineralType !== lab.boostType) lab.room.addTransportTask('labBoostOut')
    // if (!lab.mineralType || (lab.mineralType === lab.boostType && lab.store[lab.mineralType] < lab.capacity / 2)) lab.room.addTransportTask('labBoostIn')
}

StructureLab.prototype.setBoostType = function (boostType) {
    if (this.store[boostType] === undefined) return
    this.room.memory.labs[this.id] = boostType
}

Room.prototype.setInLab = function (pos) {
    const lab = pos.lookForStructure(STRUCTURE_LAB)
    if (!lab) return
    const hasInLab1 = !!this.inLab1
    hasInLab1 ? (this.memory.labs[lab.id] = 'inLab2') : (this.memory.labs[lab.id] = 'inLab1')
    this.log(`inLab${hasInLab1 ? 2 : 1} 已设置在 [${pos.x},${pos.y}]`)
}

Object.defineProperty(StructureLab.prototype, 'boostType', {
    get() {
        return this.room.memory.labs[this.id]
    },
    configurable: true
})

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

const reactionSourceMap = {
    [RESOURCE_HYDROXIDE]: [RESOURCE_HYDROGEN, RESOURCE_OXYGEN],
    [RESOURCE_ZYNTHIUM_KEANITE]: [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
    [RESOURCE_UTRIUM_LEMERGITE]: [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
    [RESOURCE_GHODIUM]: [RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE],
    [RESOURCE_ZYNTHIUM_OXIDE]: [RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN],
    [RESOURCE_ZYNTHIUM_HYDRIDE]: [RESOURCE_ZYNTHIUM, RESOURCE_HYDROGEN],
    [RESOURCE_KEANIUM_OXIDE]: [RESOURCE_KEANIUM, RESOURCE_OXYGEN],
    [RESOURCE_KEANIUM_HYDRIDE]: [RESOURCE_KEANIUM, RESOURCE_HYDROGEN],
    [RESOURCE_UTRIUM_OXIDE]: [RESOURCE_UTRIUM, RESOURCE_OXYGEN],
    [RESOURCE_UTRIUM_HYDRIDE]: [RESOURCE_UTRIUM, RESOURCE_HYDROGEN],
    [RESOURCE_LEMERGIUM_OXIDE]: [RESOURCE_LEMERGIUM, RESOURCE_OXYGEN],
    [RESOURCE_LEMERGIUM_HYDRIDE]: [RESOURCE_LEMERGIUM, RESOURCE_HYDROGEN],
    [RESOURCE_GHODIUM_OXIDE]: [RESOURCE_GHODIUM, RESOURCE_OXYGEN],
    [RESOURCE_GHODIUM_HYDRIDE]: [RESOURCE_GHODIUM, RESOURCE_HYDROGEN],
    [RESOURCE_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ACID]: [RESOURCE_KEANIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_UTRIUM_ACID]: [RESOURCE_UTRIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_GHODIUM_ACID]: [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ACID]: [RESOURCE_KEANIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_UTRIUM_ACID]: [RESOURCE_UTRIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_GHODIUM_ACID]: [RESOURCE_GHODIUM_ACID, RESOURCE_CATALYST],
}
