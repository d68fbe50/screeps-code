const ROLE_TYPES = { // 注意与 prototype_creep.js 的 roleRequires 保持一致
    claimer: 0, // priority
    defender: 0,
    depoDefender: 0,
    depoHarvester: 0,
    harvester: 95,
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
    squadAttacker: 0,
    squadDismantler: 0,
    squadHealer: 0,
    squadRanged: 0,
    transporter: 99,
    worker: 0
}

const SUBMIT_STRUCTURE_TYPES = {
    centerLink: 0,
    factory: 0,
    storage: 0,
    terminal: 0
}

const TRANSPORT_TYPES = {
    fillExtension: 99,
    fillTower: 95,
    labEnergy: 0,
    labIn: 0,
    labOut: 0,
    nukerEnergy: 0,
    nukerG: 0,
    powerSpawnEnergy: 0,
    powerSpawnPower: 0
}

const WORK_TYPES = {
    build: 0,
    repair: 0,
    upgrade: 0
}

module.exports = { ROLE_TYPES, SUBMIT_STRUCTURE_TYPES, TRANSPORT_TYPES, WORK_TYPES }
