interface global { }
interface Game { }
interface Room { }
interface Structure { run }
interface Creep { run }
interface PowerCreep { run }

interface Memory { }
interface RoomMemory { centerLinkId, upgradeLinkId, rcl }
interface SpawnMemory { }
interface CreepMemory { role, home, config, ready, working }
interface PowerCreepMemory { }
interface FlagMemory { }

interface roleRequire { isNeed, prepare, source, target, bodys }
