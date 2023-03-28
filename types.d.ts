interface Room { container, mineral, rampart, source, spawn, tower, wall }
interface Structure { run, onBuildComplete, store }
interface Creep { run }
interface PowerCreep { run }
interface Flag { run }

interface Memory { allCreeps, avoidRooms, delayTasks, isVisualPath, stats }
interface RoomMemory {
    centerPos, isAutoLayout, rcl, // base
    constructionSiteId, constructionSiteType, constructionSitePos, // constructionSite
    sourceContainerIds, upgradeContainerId, // container
    centerLinkId, upgradeLinkId, // link
    spawnLock, remoteLocks, // lock
    TaskCenter, TaskSpawn, TaskTransport, TaskWork, TaskTest, // task
    needRepairWallId, useRuinEnergy // other

}
interface CreepMemory {
    role, home, config, task,
    ready, working, dontNeed, dontPullMe,
    energySourceId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
