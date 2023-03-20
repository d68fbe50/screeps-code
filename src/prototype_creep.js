const roles = {
    claimer: require('./role_claimer'),
    defender: require('./role_defender'),
    depoDefender: require('./role_depoDefender'),
    depoHarvester: require('./role_depoHarvester'),
    harvester: require('./role_harvester'),
    helper: require('./role_helper'),
    mineHarvester: require('./role_mineHarvester'),
    pbAttacker: require('./role_pbAttacker'),
    pbDefender: require('./role_pbDefender'),
    pbHealer: require('./role_pbHealer'),
    pbTransporter: require('./role_pbTransporter'),
    remoteHarvester: require('./role_remoteHarvester'),
    remoteTransporter: require('./role_remoteTransporter'),
    reserver: require('./role_reserver'),
    squadAttacker: require('./role_squadAttacker'),
    squadDismantler: require('./role_squadDismantler'),
    squadHealer: require('./role_squadHealer'),
    squadRanged: require('./role_squadRanged'),
    transporter: require('./role_transporter'),
    worker: require('./role_worker')
}

Creep.prototype.log = function() {
    //
}

Creep.prototype.run = function() {
    roles
}
