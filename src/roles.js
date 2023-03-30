module.exports = {
    'centerTransporter': {
        priority: 7, shortName: 'c', require: require('./role_centerTransporter')
    },
    'claimer': {
        priority: 0, shortName: 'claim', require: require('./role_claimer')
    },
    'defender': {
        priority: 0, shortName: 'd', require: require('./role_defender')
    },
    'depoHarvester': {
        priority: 0, shortName: 'depo', require: require('./role_depoHarvester')
    },
    'harvester': {
        priority: 9, shortName: 'h', require: require('./role_harvester')
    },
    'helper': {
        priority: 0, shortName: 'help', require: require('./role_helper')
    },
    'mineHarvester': {
        priority: 0, shortName: 'mine', require: require('./role_mineHarvester')
    },
    'powerAttacker': {
        priority: 0, shortName: 'power', require: require('./role_powerAttacker')
    },
    'powerHealer': {
        priority: 0, shortName: 'power', require: require('./role_powerHealer')
    },
    'remoteHarvester': {
        priority: 0, shortName: 'rh', require: require('./role_remoteHarvester')
    },
    'remoteTransporter': {
        priority: 0, shortName: 'rt', require: require('./role_remoteTransporter')
    },
    'reserver': {
        priority: 0, shortName: 'reserve', require: require('./role_reserver')
    },
    'squadAttacker': {
        priority: 0, shortName: 'x', require: require('./role_squadAttacker')
    },
    'squadDismantler': {
        priority: 0, shortName: 'x', require: require('./role_squadDismantler')
    },
    'squadHealer': {
        priority: 0, shortName: 'x', require: require('./role_squadHealer')
    },
    'squadRanged': {
        priority: 0, shortName: 'x', require: require('./role_squadRanged')
    },
    'transporter': {
        priority: 8, shortName: 't', require: require('./role_transporter')
    },
    'upgrader': {
        priority: 0, shortName: 'u', require: require('./role_upgrader')
    },
    'worker': {
        priority: 0, shortName: 'w', require: require('./role_worker')
    }
}
