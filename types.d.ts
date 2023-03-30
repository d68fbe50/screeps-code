interface Room { container, extension, inLab1, inLab2, lab, mineral, rampart, source, spawn, tower, wall }
interface Structure { onBuildComplete, store }

interface Memory { allCreeps, avoidRooms, delayTasks, isVisualPath, stats }
interface RoomMemory {
    centerPos, isAutoLayout, rcl,
    constructionSiteId, constructionSiteType, constructionSitePos,
    sourceContainerIds, upgradeContainerId,
    centerLinkId, upgradeLinkId,
    spawnLock, remoteLocks,
    TaskCenter, TaskRemote, TaskSpawn, TaskTransport, TaskWork, TaskTest,
    transporterAmount, workerAmount, upgraderAmount,
    lab, needRepairWallId, useRuinEnergy
}
interface CreepMemory {
    role, home, config, task,
    boostReady, ready, working, dontNeed, dontPullMe,
    energySourceId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }
