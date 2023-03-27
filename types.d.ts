interface Room { container, mineral, rampart, source, wall }
interface Structure { run, onBuildComplete, store }
interface Creep { run }
interface PowerCreep { run }
interface Flag { run }

interface Memory { allCreeps, delayTasks, stats }
interface RoomMemory {
    rcl, centerPos,
    spawnLock, remoteLocks,
    TaskCenter, TaskSpawn, TaskTransport, TaskWork, TaskTest,
    constructionSiteId, constructionSiteType, constructionSitePos,
    sourceContainerIds, upgradeContainerId,
    centerLinkId, upgradeLinkId,
    needRepairWallId
}
interface CreepMemory {
    role, home, config, task,
    ready, working, dontNeed, dontPullMe,
    energySourceId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
