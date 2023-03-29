interface Room { container, mineral, rampart, source, spawn, tower, wall }
interface Structure { onBuildComplete, store }

interface Memory { allCreeps, avoidRooms, delayTasks, isVisualPath, stats }
interface RoomMemory {
    centerPos, isAutoLayout, rcl, // base
    constructionSiteId, constructionSiteType, constructionSitePos, // constructionSite
    sourceContainerIds, upgradeContainerId, // container
    centerLinkId, upgradeLinkId, // link
    spawnLock, remoteLocks, // lock
    TaskCenter, TaskSpawn, TaskTransport, TaskWork, TaskTest, // task
    needRepairWallId, useRuinEnergy // others
}
interface CreepMemory {
    role, home, config, task,
    ready, working, dontNeed, dontPullMe,
    energySourceId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
