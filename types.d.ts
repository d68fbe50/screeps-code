interface Room { container, extension, inLab1, inLab2, lab, mineral, rampart, source, spawn, tower, wall }
interface Structure { onBuildComplete, store }

interface Memory { allCreeps, avoidRooms, delayTasks, isVisualPath, stats }
interface RoomMemory {
    centerPos, isAutoLayout, rcl, state,
    constructionSiteId, constructionSiteType, constructionSitePos,
    sourceContainerIds, upgradeContainerId, labContainerId,
    centerLinkId, upgradeLinkId,
    spawnLock, remoteLocks,
    TaskCenter, TaskRemote, TaskSpawn, TaskTransport, TaskWork, TaskTest,
    transporterAmount, workerAmount, upgraderAmount,
    labs, needRepairWallId, useRuinEnergy
}
interface CreepMemory {
    role, home, config, task,
    ready, working, dontNeed, dontPullMe,
    boostReady, boostCounts, waitBoostTypes,
    bodyCounts, energySourceId
}
interface PowerCreepMemory {}
interface FlagMemory { checked }
