// 消除代码提示用的，不代表正确

interface global { }
interface Game { }
interface Room { source, mineral, wall, rampart }
interface Structure { run, store }
interface Creep { run }
interface PowerCreep { run }
interface Flag { run }

interface Memory { allCreepNameList, stats }
interface RoomMemory { centerLinkId, upgradeLinkId, rcl, centerPos, lockSpawnTime, remoteSourceLock, transporterList, workerList, constructionSiteId, needRepairWallId, sourceContainerList,
    TaskCenter, TaskSpawn, TaskTransport, TaskWork, TaskTest }
interface SpawnMemory { }
interface CreepMemory { role, home, config, ready, working, needFillSpawnExtId, needFillTowerId, energySourceId, taskKey, taskBegin }
interface PowerCreepMemory { }
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
