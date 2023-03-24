interface global { }
interface Game { }
interface Room { source, mineral, wall, rampart }
interface Structure { run }
interface Creep { run }
interface PowerCreep { run }
interface Flag { run }

interface Memory { allCreepNameList, stats }
interface RoomMemory { centerLinkId, upgradeLinkId, rcl, centerPos, lockSpawn, remoteSourceLock, transporterList, workerList, constructionSiteId, needRepairWallId }
interface SpawnMemory { }
interface CreepMemory { role, home, config, ready, working, needFillSpawnExtId, needFillTowerId }
interface PowerCreepMemory { }
interface FlagMemory { checked }

interface roleRequire { isNeed, prepare, source, target, bodys }
