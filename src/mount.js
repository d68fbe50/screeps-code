require('./prototype_creep')
require('./prototype_creepRelease')
require('./prototype_flag')
require('./prototype_global')
require('./prototype_powerCreep')
require('./prototype_room')
require('./prototype_roomPosition')
require('./prototype_structure')
require('./prototype_taskQueue')
require('./structure_container')
require('./structure_controller')
require('./structure_extractor')
require('./structure_lab')
require('./structure_link')
require('./structure_nuker')
require('./structure_observer')
require('./structure_powerSpawn')
require('./structure_spawn')
require('./structure_storage')
require('./structure_terminal')
require('./structure_tower')
!('sim' in Game.rooms) && require('./wheel_move')
require('./wheel_resourceOverall')
require('./wheel_structureCache')
require('./wheel_structureVisual')
