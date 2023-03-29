interface Room { container, extension, mineral, rampart, source, spawn, tower, wall }
interface Structure { onBuildComplete, store }

interface Memory { allCreeps, avoidRooms, delayTasks, isVisualPath, stats }
interface RoomMemory {
    centerPos, isAutoLayout, rcl, // base
    constructionSiteId, constructionSiteType, constructionSitePos, // constructionSite
    sourceContainerIds, upgradeContainerId, // container
    centerLinkId, upgradeLinkId, // link
    spawnLock, remoteLocks, // lock
    TaskCenter, TaskSpawn, TaskTransport, TaskWork, TaskTest, // task
    transporterAmount, workerAmount, upgraderAmount,
    needRepairWallId, useRuinEnergy // others
}
interface CreepMemory {
    role, home, config, task,
    ready, working, dontNeed, dontPullMe,
    energySourceId, needFillExtensionId, needFillTowerId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
