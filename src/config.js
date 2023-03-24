const wallHitsMax = 100000

const ROLE_TYPES = { // 注意与 prototype_creep.js 的 roleRequires 保持一致
    centerTransporter: 7, // priority
    claimer: 0,
    defender: 6,
    depoDefender: 0,
    depoHarvester: 0,
    harvester: 8,
    helper: 0,
    mineHarvester: 0,
    powerAttacker: 0,
    powerDefender: 0,
    powerHealer: 0,
    powerTransporter: 0,
    remoteHarvester: 0,
    remoteDefender: 0,
    remoteTransporter: 0,
    reserver: 0,
    squadAttacker: 5,
    squadDismantler: 5,
    squadHealer: 5,
    squadRanged: 5,
    starter: 0,
    transporter: 9,
    upgrader: 0,
    worker: 0
}

const SUBMIT_STRUCTURE_TYPES = {
    centerLink: 9,
    factory: 3,
    storage: 5,
    terminal: 7
}

const TRANSPORT_TYPES = {
    fillExtension: 9,
    fillTower: 7,
    labEnergy: 5,
    labIn: 5,
    labOut: 5,
    nukerEnergy: 0,
    nukerG: 0,
    powerSpawnEnergy: 1,
    powerSpawnPower: 1
}

const WORK_TYPES = {
    build: 9,
    repair: 6,
    upgrade: 3
}

module.exports = { ROLE_TYPES, SUBMIT_STRUCTURE_TYPES, TRANSPORT_TYPES, WORK_TYPES, wallHitsMax }
