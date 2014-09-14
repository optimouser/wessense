
GAME.Monsters = GAME.Monsters || { 
	REVISION: '1',
	mList: []
};

GAME.Monsters.Reset = function() {
	this.mList = [];
};

GAME.Monsters.Get = function(name) { return this.mUnits[name]; };

//
// states: 
//		- 'cowardly': moves away from player and friendly units
//		- 'friendly': follows player / does not move / can talk to player
//		- 'neutral' : no reaction on player
//		- 'aggressive' : if player is visible - hunt him/her down
//		- 'angered': hunt player even he/she is not visible but in sense range
//

GAME.Monsters.mUnits = {

	//-------------- Monsters New -----------------------------------------------------------------------------------------------------------
	'tusker'	: { name: "Tusker", lvl: 1, exp:  35, hp: 28, hpmax: 28, n_hth: 1, n_rng: 0, hth: 8, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 3,
						 state: 'aggressive', spawn: ['grass','dirt'], passable_tiles: ["water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud"], 
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small', 20], ['bonus_potion_health',50] ],
						passable_objects: ['forest_oasis', 'monolith' ] },
	'plant'		: { name: "Carnivore Plant", lvl: 1, exp:  30, hp: 14, hpmax: 14, n_hth: 4, n_rng: 3, hth: 3, rng: 2, def: 0, sense: 3.61, sprite: 'monsters', offset: 4,
						state: 'aggressive', spawn: ['swamp_shallow', 'dirt'], passable_tiles: ["dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud"], 
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small', 20], ['bonus_potion_health',50] ],
						passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.25, rng_effect: "thorns" },
	'gorer'		: { name: "Gorer", lvl: 2, exp: 120, hp: 62, hpmax: 62, n_hth: 2, n_rng: 0, hth: 12, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 8,
						state: 'aggressive', spawn: ['grass','dirt','mud', 'soil'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small',20], ['bonus_potion_health',50] ],
						passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ], 
						passable_objects: [ 'forest_oasis', 'monolith' ] },
	'bigfoot'	: { name: "Bigfoot", lvl: 2, exp: 120, hp: 42, hpmax: 42, n_hth: 3, n_rng: 0, hth: 9, rng: 0, def: 30, sense: 3.61, sprite: 'monsters', offset: 10,
						 state: 'aggressive', spawn: ['snow','mud'],
						tile_mod: { 'snow': 50, 'mud': 20 }, obj_mod: { 'mountains': 20 },
						 bonus_drop: [ ['bonus_armor',25], ['bonus_gold_medium',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ], 
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'golem'		: { name: "Golem", lvl: 2, exp: 150, hp: 88, hpmax: 88, n_hth: 2, n_rng: 0, hth: 16, rng: 0, def: 75, sense: 3.61, sprite: 'monsters', offset: 11,
						 state: 'aggressive', spawn: ['desert'], 
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_armor',10], ['bonus_potion_blue',10], ['bonus_potion_green',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "cobblestone", "soil", "mud" ], 
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'hydra'		: { name: "Hydra", lvl: 3, exp: 280, hp: 94, hpmax: 94, n_hth: 3, n_rng: 2, hth: 12, rng: 12, def: 55, sense: 5.01, sprite: 'monsters', offset: 15,
						 state: 'aggressive', spawn: ['swamp_shallow'], regeneration: 16, poison: true,
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30 }, obj_mod: { }, 
						bonus_drop: [ ['bonus_armor',35],['bonus_gold_large',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud" ], 
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "gaze" },
	'ancienthydra': { name: "Ancient Hydra", lvl: 4, exp: 350, hp: 124, hpmax: 124, n_hth: 4, n_rng: 3, hth: 14, rng: 10, def: 65, sense: 5.01, sprite: 'monsters', offset: 16,
						 state: 'aggressive', spawn: ['swamp_deep'], regeneration: 22, poison: true,
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30 }, obj_mod: { },
						 bonus_drop: [ ['bonus_armor_gold',45], ['bonus_potion_health',50] ],
						 passable_tiles: [ "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 4.25, rng_effect: "gaze" },
	'fireghost'	: { name: "Fire Elemental", lvl: 2, exp: 150, hp: 64, hpmax: 64, n_hth: 3, n_rng: 0, hth: 22, rng: 0, def: 30, sense: 3.61, sprite: 'monsters', offset: 17,
						 state: 'aggressive', spawn: [ 'desert' ],
						tile_mod: { 'desert': 20 }, obj_mod: {},
						 bonus_drop: [ ['bonus_staff',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "desert", "dirt" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'eyestalk'	: { name: "Eyestalk", lvl: 1, exp: 40, hp: 16, hpmax: 16, n_hth: 3, n_rng: 0, hth: 4, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 18,
						 state: 'aggressive', spawn: ['grass','dirt','soil'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'rat'		: { name: "Large Rat", lvl: 0, exp:  20, hp: 15, hpmax: 15, n_hth: 4, n_rng: 0, hth: 2, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 0,
						 state: 'aggressive', spawn: ['grass','dirt'], poison: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'spider'	: { name: "Spider", lvl: 3, exp:  150, hp: 54, hpmax: 54, n_hth: 2, n_rng: 3, hth: 18, rng: 8, def: 0, sense: 3.61, sprite: 'monsters', offset: 1,
						 rng_range: 2.83, rng_effect: "web", entangle: true,
						 state: 'neutral', spawn: [ 'grass', 'dirt', 'soil' ],
						tile_mod: { 'swamp_shallow': 10, 'swamp_deep': 10 },
						 bonus_drop: [ ['bonus_gold_small',10], ['bonus_potion_health',50] ],
						 obj_mod: { 'forest_palm': 10, 'forest_coniferous': 20, 'forest_deducious': 20,
										 'forest_snow_coniferous': 20, 'forest_autumn': 20, 'forest_snow_dead': 10, 'forest_palm_desert': 10 },
						 passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'monolith' ] },
	'scorpion'	: { name: "Scorpion", lvl: 1, exp:  50, hp: 40, hpmax: 40, n_hth: 4, n_rng: 0, hth: 4, rng: 0, def: 33, sense: 3.61, sprite: 'monsters', offset: 2,
						 armor_piercing: true, poison: true,
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 state: 'aggressive', spawn: ['sand','desert','dirt','mud'],
						tile_mod: { 'desert': 20 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_armor',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'tentacle'	: { name: "Tentacle", lvl: 1, exp:  50, hp: 28, hpmax: 28, n_hth: 3, n_rng: 0, hth: 4, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 5,
						 state: 'aggressive', spawn: ['swamp_shallow'], entangle: true,
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30 }, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "swamp_shallow", "swamp_deep" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'ant'		: { name: "Ant", lvl: 0, exp:  30, hp: 18, hpmax: 18, n_hth: 4, n_rng: 0, hth: 3, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 6,
						 state: 'aggressive', spawn: ['grass','dirt'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'monolith' ] },
	'wolf'		: { name: "Wolf", lvl: 2, exp:  90, hp: 32, hpmax: 32, n_hth: 3, n_rng: 0, hth: 5, rng: 0, def: 0, sense: 3.61, sprite: 'monsters', offset: 7,
						 state: 'aggressive', spawn: [ 'grass','dirt' ],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_gold_small',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "dirt", "grass", "grass_pale", "swamp_shallow", "cobblestone", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'yeti'		: { name: "Yeti", lvl: 4, exp: 200, hp: 142, hpmax: 142, n_hth: 2, n_rng: 0, hth: 32, rng: 0, def: 50, sense: 3.61, sprite: 'monsters', offset: 9,
						 state: 'aggressive', spawn: ['snow','mud'],
						tile_mod: { 'snow': 20 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_armor_gold',50], ['bonus_potion_health',50] ],
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'cuttlefish': { name: "Cuttle Fish", lvl: 2, exp: 100, hp: 67, hpmax: 67, n_hth: 3, n_rng: 2, hth: 10, rng: 6, def: 25, sense: 3.61, sprite: 'monsters', offset: 12,
						 state: 'aggressive', spawn: ['water_medium'],
						tile_mod: { 'water_shallow': 30, 'water_medium': 50 }, obj_mod: {},
						 bonus_drop: [ ['bonus_armor',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.25, rng_effect: "ink" },
	'greatwolf'	: { name: "Great Wolf", lvl: 2, exp: 100, hp: 45, hpmax: 45, n_hth: 4, n_rng: 0, hth: 5, rng: 0, def: 10, sense: 3.61, sprite: 'monsters', offset: 13,
						 state: 'aggressive', spawn: [ 'cobblestone', 'soil', 'mud', 'snow' ], 
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_armor',10], ['bonus_gold_medium',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'seaserpent': { name: "Sea Serpent", lvl: 3, exp: 150, hp: 85, hpmax: 85, n_hth: 2, n_rng: 0, hth: 18, rng: 0, def: 33, sense: 3.61, sprite: 'monsters', offset: 14,
						 state: 'aggressive', spawn: [ 'water_medium' ], poison: true,
						tile_mod: { 'water_shallow': 30, 'water_medium': 60 }, obj_mod: {},
						 bonus_drop: [ ['bonus_armor',10], ['bonus_gold_medium',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	//----------- Enemies ---------------------------------------------------------------------------------------------------------------------
	'goblin'		: { name: "Goblin", lvl: 0, exp: 18, hp: 18, hpmax: 18, n_hth: 3, n_rng: 1, hth: 6, rng: 3, def: 0, sense: 3.61, sprite: 'enemies', offset: 0,
						 state: 'aggressive', spawn: ['sand','grass','dirt','cobblestone'], is_orc: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_lance',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.25, rng_effect: "spear" },
	'wolf_rider': { name: "Wolf Rider", lvl: 1, exp: 30, hp: 32, hpmax: 32, n_hth: 3, n_rng: 0, hth: 5, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset: 1,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'], is_orc: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [  ['bonus_axe',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'skeleton'		: { name: "Skeleton", lvl: 1, exp: 35, hp: 34, hpmax: 34, n_hth: 3, n_rng: 0, hth: 7, rng: 0, def: 20, sense: 3.61, sprite: 'enemies', offset: 2,
						 state: 'aggressive', spawn: ['dirt','cobblestone','mud'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_axe',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'skeleton_archer': { name: "Skeleton Archer", lvl: 1, exp: 35, hp: 31, hpmax: 31, n_hth: 0, n_rng: 3, hth: 0, rng: 6, def: 10, sense: 3.61, sprite: 'enemies', offset: 3,
						 state: 'aggressive', spawn: ['dirt','cobblestone','mud'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.83, rng_effect: "bone_arrow" },
	'zombie'		: { name: "Zombie", lvl: 0, exp: 24, hp: 18, hpmax: 18, n_hth: 2, n_rng: 0, hth: 6, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset: 4,
						 state: 'aggressive', spawn: ['sand', 'swamp_shallow'], is_undead: true, poison: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'death_knight'	: { name: "Death Knight", lvl: 3, exp: 150, hp: 66, hpmax: 66, n_hth: 4, n_rng: 0, hth: 11, rng: 0, def: 30, sense: 3.61, sprite: 'enemies', offset: 5,
						 state: 'aggressive', spawn: ['dirt','cobblestone','mud'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'necrophage'	: { name: "Necrophage", lvl: 2, exp: 120, hp: 47, hpmax: 47, n_hth: 3, n_rng: 0, hth: 7, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset: 6,
						 state: 'aggressive', spawn: ['swamp_shallow','swamp_deep'], is_undead: true, poison: true,
						tile_mod: { 'swamp_deep': 30, 'swamp_shallow': 20 }, obj_mod: {},
						 bonus_drop: [ ['bonus_book',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'bone_shooter'	: { name: "Bone Shooter", lvl: 2, exp: 80, hp: 40, hpmax: 40, n_hth: 0, n_rng: 3, hth: 1, rng: 10, def: 15, sense: 3.61, sprite: 'enemies', offset: 7,
						 armor_piercing: true, is_undead: true,
						 state: 'aggressive', spawn: ['dirt','cobblestone','mud'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',40], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 4.25, rng_effect: "bone_arrow" },
	'zombie_naga'	: { name: "Zombie Naga", lvl: 1, exp: 48, hp: 14, hpmax: 14, n_hth: 2, n_rng: 0, hth: 9, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset: 8,
						 state: 'aggressive', spawn: ['swamp_shallow','swamp_deep'], is_undead: true, poison: true,
						tile_mod: { 'swamp_deep': 30, 'swamp_shallow': 20 }, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'troll_yelp'	: { name: "Troll Yelp", lvl: 1, exp: 36, hp: 62, hpmax: 62, n_hth: 2, n_rng: 0, hth: 7, rng: 0, def: 33, sense: 3.61, sprite: 'enemies', offset: 9,
						 state: 'aggressive', spawn: ['soil','snow'], regeneration: 8,
						tile_mod: { 'snow': 20, 'mud': 10 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_staff',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'troll'			: { name: "Troll", lvl: 2, exp: 66, hp: 95, hpmax: 95, n_hth: 2, n_rng: 0, hth: 14, rng: 0, def: 40, sense: 3.61, sprite: 'enemies', offset:10,
						 state: 'aggressive', spawn: ['soil','snow'], regeneration: 8,
						tile_mod: { 'snow': 20, 'mud': 10 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_armor',20], ['bonus_axe',20], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'troll_shaman'	: { name: "Troll Shaman", lvl: 2, exp: 100, hp: 80, hpmax: 80, n_hth: 2, n_rng: 3, hth: 7, rng: 7, def: 33, sense: 3.61, sprite: 'enemies', offset:11,
						 state: 'aggressive', spawn: ['soil','snow'], regeneration: 6, is_magicuser: true, entangle: true,
						tile_mod: { 'snow': 20, 'mud': 10 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_book_necro',10], ['bonus_book',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ], rng_range: 3.61, rng_effect: "chakram" },
	'troll_warrior'	: { name: "Troll Warrior", lvl: 3, exp: 150, hp: 120, hpmax: 120, n_hth: 2, n_rng: 0, hth: 20, rng: 0, def: 45, sense: 3.61, sprite: 'enemies', offset:12,
						 state: 'aggressive', spawn: ['soil','snow'], regeneration: 10,
						tile_mod: { 'snow': 20, 'mud': 10 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_sword',10], ['bonus_axe',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'ogre'			: { name: "Ogre", lvl: 2, exp: 88, hp: 120, hpmax: 120, n_hth: 3, n_rng: 0, hth: 10, rng: 0, def: 25, sense: 3.61, sprite: 'enemies', offset:13,
						 state: 'aggressive', spawn: ['grass'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',10], ['bonus_lance',10], ['bonus_potion_blue',5], ['bonus_potion_green',5], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'orc_grunt'		: { name: "Orc Grunt", lvl: 1, exp: 42, hp: 38, hpmax: 38, n_hth: 2, n_rng: 0, hth: 9, rng: 0, def: 15, sense: 3.61, sprite: 'enemies', offset:14,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'], is_orc: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_axe',10], ['bonus_sword',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'orc_warrior'	: { name: "Orc Warrior", lvl: 2, exp: 60, hp: 58, hpmax: 58, n_hth: 3, n_rng: 0, hth: 10, rng: 0, def: 25, sense: 3.61, sprite: 'enemies', offset:15,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'], is_orc: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_axe',10], ['bonus_sword',10], ['bonus_bow',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'orc_assassin'	: { name: "Orc Assassin", lvl: 1, exp: 34, hp: 36, hpmax: 36, n_hth: 1, n_rng: 3, hth: 7, rng: 3, def: 10, sense: 3.61, sprite: 'enemies', offset:16,
						 armor_piercing: true, is_orc: true, poison: true,
						 state: 'aggressive', spawn: ['dirt','cobblestone','mud','soil'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',10], ['bonus_sword',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.83, rng_effect: "dagger" },
	'duelist'		: { name: "Duelist", lvl: 2, exp: 90, hp: 44, hpmax: 44, n_hth: 5, n_rng: 1, hth: 5, rng: 12, def: 0, sense: 3.61, sprite: 'enemies', offset:17,
						 state: 'aggressive', spawn: ['grass'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',10], ['bonus_bow',10], ['bonus_staff',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.83, rng_effect: "muzzle_1" },
	'leutenant'		: { name: "Leutenant", lvl: 2, exp: 80, hp: 40, hpmax: 40, n_hth: 3, n_rng: 3, hth: 8, rng: 5, def: 40, sense: 3.61, sprite: 'enemies', offset:18,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [['bonus_sword',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "arrows_2" },
	'royal_guard'	: { name: "Royal Guard", lvl: 3, exp: 150, hp: 74, hpmax: 74, n_hth: 4, n_rng: 0, hth: 11, rng: 0, def: 60, sense: 3.61, sprite: 'enemies', offset:19,
						 state: 'aggressive', spawn: [],
						 armor_piercing: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'dragoon'		: { name: "Dragoon", lvl: 2, exp: 95, hp: 49, hpmax: 49, n_hth: 4, n_rng: 1, hth: 6, rng: 12, def: 30, sense: 3.61, sprite: 'enemies', offset:20,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',20], ['bonus_sword',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.25, rng_effect: "muzzle_1" },
	'mage'			: { name: "Mage", lvl: 1, exp: 54, hp: 24, hpmax: 24, n_hth: 1, n_rng: 3, hth: 5, rng: 7, def: 0, sense: 3.61, sprite: 'enemies', offset:21,
						 state: 'aggressive', spawn: [], is_magicuser: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_book',25], ['bonus_staff',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "fireblast" },
	'necromancer'	: { name: "Dready Necromancer", lvl: 5, exp: 350, hp: 190, hpmax: 190, n_hth: 3, n_rng: 2, hth: 6, rng: 17, def: 60, sense: 3.61, sprite: 'enemies', offset:22,
						 armor_piercing: true, is_magicuser: true, is_boss: true,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_book_necro',50], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 4.25, rng_effect: "dark_missile" },
	'lich'			: { name: "Ancient Lich", lvl: 5, exp: 350, hp: 190, hpmax: 190, n_hth: 3, n_rng: 3, hth: 8, rng: 12, def: 60, sense: 3.61, sprite: 'enemies', offset:23,
						 armor_piercing: true, is_undead: true, is_magicuser: true, is_boss: true,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_book_necro',50], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 4.25, rng_effect: "dark_missile" },
	'mermaid_initate' : { name: "Mermaid Initiate", lvl: 1, exp: 50, hp: 27, hpmax: 27, n_hth: 0, n_rng: 2, hth: 0, rng: 8, def: 0, sense: 3.61, sprite: 'enemies', offset: 24,
						 state: 'neutral', spawn: ['water_shallow'],
						 bonus_drop: [ ['bonus_staff',25], ['bonus_potion_health',50] ],
						tile_mod: { 'water_shallow': 40, 'water_medium': 60, 'sand': -10, 'dirt': -20 }, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt" ], is_magic_user: true,
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.83, rng_effect: "water_spray" },
	'mermaid_fighter' : { name: "Mermaid Fighter", lvl: 1, exp: 36, hp: 36, hpmax: 36, n_hth: 3, n_rng: 0, hth: 6, rng: 0, def: 15, sense: 3.61, sprite: 'enemies', offset: 25,
						 state: 'neutral', spawn: ['water_shallow'],
						 bonus_drop: [ ['bonus_sword',10], ['bonus_potion_health',50] ],
						tile_mod: { 'water_shallow': 40, 'water_medium': 60, 'sand': -10, 'dirt': -20 }, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'naga_fighter'	: { name: "Naga Fighter", lvl: 1, exp: 32, hp: 33, hpmax: 33, n_hth: 4, n_rng: 0, hth: 4, rng: 0, def: 20, sense: 3.61, sprite: 'enemies', offset: 26,
						 state: 'aggressive', spawn: ['swamp_shallow'], poison: true,
						 bonus_drop: [ ['bonus_sword',25], ['bonus_potion_health',50] ],
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30, 'mud': 10, 'grass': -20, 'dirt': -10 }, obj_mod: {},
						 passable_tiles: [ "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'naga_warrior'	: { name: "Naga Warrior", lvl: 2, exp: 66, hp: 43, hpmax: 43, n_hth: 4, n_rng: 0, hth: 7, rng: 0, def: 30, sense: 3.61, sprite: 'enemies', offset: 27,
						 armor_piercing: true, poison: true,
						 state: 'aggressive', spawn: ['swamp_shallow'],
						 bonus_drop: [ ['bonus_sword',50], ['bonus_potion_health',50] ],
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30, 'mud': 10, 'grass': -20, 'dirt': -10 }, obj_mod: {},
						 passable_tiles: [ "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'naga_initiate'	: { name: "Naga Initiate", lvl: 1, exp: 60, hp: 34, hpmax: 34, n_hth: 0, n_rng: 2, hth: 0, rng: 10, def: 0, sense: 3.61, sprite: 'enemies', offset: 28,
						 state: 'aggressive', spawn: ['swamp_shallow'],
						 bonus_drop: [ ['bonus_book',10], ['bonus_staff',10], ['bonus_potion_health',50] ],
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30, 'mud': 10, 'grass': -20, 'dirt': -10 }, obj_mod: {}, is_magicuser: true,
						 passable_tiles: [ "dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.83, rng_effect: "water_spray" },
	'vampire_lady'	: { name: "Vampire Lady", lvl: 3, exp: 150, hp: 48, hpmax: 48, n_hth: 3, n_rng: 0, hth: 14, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset: 29,
						 state: 'aggressive', spawn: [], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'skeleton_rider': { name: "Skeleton Rider", lvl: 2, exp: 100, hp: 45, hpmax: 45, n_hth: 2, n_rng: 0, hth: 9, rng: 0, def: 20, sense: 3.61, sprite: 'enemies', offset: 30,
						 state: 'aggressive', spawn: ['soil'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_axe',15], ['bonus_sword',10], ['bonus_lance',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'skelespider_mage': { name: "Spider Mage", lvl: 2, exp: 150, hp: 36, hpmax: 36, n_hth: 2, n_rng: 2, hth: 5, rng: 12, def: 30, sense: 3.61, sprite: 'enemies', offset: 31,
						 state: 'aggressive', spawn: [ 'soil', 'swamp_shallow' ], is_undead: true, is_magicuser: true, entangle: true,
						tile_mod: { 'swamp_shallow': 20, 'swamp_deep': 30, 'mud': 10 }, obj_mod: {},
						 bonus_drop: [ ['bonus_book_necro',25],['bonus_staff',15], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "dark_missile" },
	'orc_sovereign'	: { name: "Orc Sovereign", lvl: 4, exp: 250, hp: 92, hpmax: 92, n_hth: 4, n_rng: 4, hth: 12, rng: 9, def: 85, sense: 3.61, sprite: 'enemies', offset:32,
						 armor_piercing: true, is_orc: true, is_boss: true,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_armor_gold',25], ['bonus_sword',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 4.25, rng_effect: "arrows_2" },
	'orc_archer'	: { name: "Orc Archer", lvl: 1, exp: 39, hp: 32, hpmax: 32, n_hth: 0, n_rng: 3, hth: 0, rng: 6, def: 0, sense: 3.61, sprite: 'enemies', offset:33,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'], is_orc: true, poison: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "arrows_1" },
	'orc_xbowman'	: { name: "Orc Crossbowman", lvl: 2, exp: 80, hp: 43, hpmax: 43, n_hth: 0, n_rng: 3, hth: 0, rng: 8, def: 15, sense: 3.61, sprite: 'enemies', offset:34,
						 armor_piercing: true, is_orc: true,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_bow',40], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 3.61, rng_effect: "arrows_2" },
	'chocobone'	: { name: "Chocobone", lvl: 2, exp: 100, hp: 45, hpmax: 45, n_hth: 2, n_rng: 0, hth: 9, rng: 0, def: 20, sense: 3.61, sprite: 'enemies', offset:35,
						 state: 'aggressive', spawn: ['cobblestone','soil','swamp_shallow'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_lance',40], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'revenant'	: { name: "Revenant", lvl: 2, exp: 85, hp: 47, hpmax: 47, n_hth: 4, n_rng: 0, hth: 8, rng: 0, def: 30, sense: 3.61, sprite: 'enemies', offset:36,
						 state: 'aggressive', spawn: ['cobblestone','soil','swamp_shallow'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_axe',40], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'zombietroll'	: { name: "Zombie Troll", lvl: 1, exp: 68, hp: 33, hpmax: 33, n_hth: 2, n_rng: 0, hth: 6, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset:37,
						 state: 'aggressive', spawn: ['swamp_shallow', 'swamp_deep'], regeneration: 4, is_undead: true, poison: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'highwayman'	: { name: "Highwayman", lvl: 3, exp: 150, hp: 70, hpmax: 70, n_hth: 4, n_rng: 0, hth: 11, rng: 0, def: 33, sense: 3.61, sprite: 'enemies', offset:38,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'],
						tile_mod: { 'grass': -10, 'sand': -10 }, obj_mod: {},
						 bonus_drop: [ ['bonus_armor',25], ['bonus_sword',10], ['bonus_axe',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'thief'			: { name: "Thief", lvl: 1, exp: 28, hp: 24, hpmax: 24, n_hth: 3, n_rng: 0, hth: 4, rng: 0, def: 0, sense: 3.61, sprite: 'enemies', offset:39,
						 armor_piercing: true, poison: true,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_sword',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'mudcrawler'	: { name: "Mud Crawler", lvl: 1, exp: 38, hp: 24, hpmax: 24, n_hth: 4, n_rng: 0, hth: 4, rng: 0, def: 20, sense: 3.61, sprite: 'monsters', offset:23,
						 state: 'aggressive', spawn: ['soil'], entangle: true,
						tile_mod: { 'mud': 20, 'snow': 20 }, obj_mod: { 'mountains': 20 },
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },

	'troll_lobber'	: { name: "Troll Lobber", lvl: 2, exp: 120, hp: 54, hpmax: 54, n_hth: 0, n_rng: 2, hth: 0, rng: 14, def: 20, sense: 3.61, sprite: 'enemies', offset:40,
						 state: 'aggressive', spawn: ['soil','snow'], regeneration: 8,
						tile_mod: { 'snow': 20, 'mud': 10 }, obj_mod: { 'mountains': 10 },
						 bonus_drop: [ ['bonus_armor',25], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ], rng_range: 3.61, rng_effect: "stone_large" },

	'outlaw'	: { name: "Outlaw", lvl: 2, exp: 70, hp: 44, hpmax: 44, n_hth: 2, n_rng: 0, hth: 12, rng: 0, def: 15, sense: 3.61, sprite: 'enemies', offset:41,
						 state: 'aggressive', spawn: ['grass','dirt','cobblestone'],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_staff',20], ['bonus_sword',10], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	'fugitive'	: { name: "Fugitive", lvl: 3, exp: 120, hp: 74, hpmax: 74, n_hth: 4, n_rng: 0, hth: 12, rng: 0, def: 25, sense: 3.61, sprite: 'enemies', offset:42,
						 state: 'aggressive', spawn: [],
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_armor_gold', 45], ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

	'brazier'	: { name: "Brazier", lvl: 1, exp: 38, hp: 24, hpmax: 24, n_hth: 0, n_rng: 2, hth: 0, rng: 12, def: 0, sense: 3.61, sprite: 'monsters', offset:19,
						 state: 'aggressive', spawn: ['desert'], rng_range: 3.61, rng_effect: "fireblast", is_magicuser: true,
						tile_mod: { 'mud': 20, 'snow': 20 }, obj_mod: { 'mountains': 20 },
						 bonus_drop: [ ['bonus_book',20], ['bonus_staff',20], ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "desert", "dirt", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },

	'bigplant'		: { name: "Huge Carnivore Plant", lvl: 2, exp:  30, hp: 34, hpmax: 34, n_hth: 5, n_rng: 5, hth: 5, rng: 3, def: 0, sense: 3.61, sprite: 'monsters', offset: 20,
						state: 'aggressive', spawn: ['swamp_shallow', 'dirt'], 
						passable_tiles: ["dirt", "grass", "grass_pale", "swamp_shallow", "swamp_deep", "soil", "mud"], 
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 2.25, rng_effect: "thorns" },

	'hellhound'	: { name: "Hellhound", lvl: 2, exp: 74, hp: 54, hpmax: 54, n_hth: 3, n_rng: 0, hth: 12, rng: 0, def: 25, sense: 3.61, sprite: 'monsters', offset:21,
						 state: 'aggressive', spawn: ['desert','cobblestone'],
						tile_mod: { 'snow': -30 }, obj_mod: { 'mountains': 20 },
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "desert", "sand", "dirt" ],
						 passable_objects: [ 'monolith' ] },

	'woseshaman'	: { name: "Wose Shaman", lvl: 3, exp: 155, hp: 84, hpmax: 84, n_hth: 2, n_rng: 4, hth: 26, rng: 12, def: 20, sense: 3.61, sprite: 'monsters', offset:22,
						 state: 'neutral', spawn: ['grass','grass_pale'], entangle: true,
						 bonus_drop: [ ['bonus_staff',40], ['bonus_book',25], ['bonus_potion_health',50] ],
						tile_mod: { }, obj_mod: { }, rng_range: 3.61, rng_effect: "thorns", is_magicuser: true,
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ ] },

	'wose'	: { name: "Wose", lvl: 2, exp: 144, hp: 92, hpmax: 92, n_hth: 2, n_rng: 0, hth: 28, rng: 0, def: 30, sense: 3.61, sprite: 'monsters', offset:24,
						 state: 'neutral', spawn: ['grass','grass_pale'], entangle: true,
						 bonus_drop: [ ['bonus_staff',20], ['bonus_potion_health',50] ],
						tile_mod: { }, obj_mod: { },
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ ] },

	'firewisp'	: { name: "Fire Wisp", lvl: 1, exp: 60, hp: 24, hpmax: 24, n_hth: 3, n_rng: 0, hth: 8, rng: 0, def: 20, sense: 3.61, sprite: 'monsters', offset: 26,
						 state: 'aggressive', spawn: [ 'desert', 'sand' ],
						tile_mod: { 'desert': 20 }, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "sand", "desert", "dirt" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	'wose_sapling'	: { name: "Wose Sapling", lvl: 1, exp: 70, hp: 54, hpmax: 54, n_hth: 2, n_rng: 0, hth: 18, rng: 0, def: 20, sense: 3.61, sprite: 'monsters', offset:27,
						 state: 'neutral', spawn: ['mud', 'dirt', 'grass','grass_pale'], entangle: true,
						 bonus_drop: [ ['bonus_staff',20], ['bonus_potion_health',50] ],
						tile_mod: { }, obj_mod: { },
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ ] },

	'magicservant'	: { name: "Magic Servant", lvl: 0, exp: 12, hp: 7, hpmax: 7, n_hth: 1, n_rng: 0, hth: 4, rng: 0, def: 90, sense: 3.61, sprite: 'monsters', offset:25,
						 state: 'neutral', spawn: [ ],
						 bonus_drop: [ ['bonus_potion_health',50] ],
						tile_mod: { }, obj_mod: { },
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ ] },

	'cockatrice' : { name: "Cockatrice", lvl: 3, exp: 132, hp: 172, hpmax: 172, n_hth: 3, n_rng: 0, hth: 16, rng: 0, def: 50, sense: 3.61, sprite: 'enemies', offset:43,
						 state: 'aggressive', spawn: ['grass','grass_pale'], poison: true,
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 tile_mod: { }, obj_mod: { },
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	'ogrechieftain' : { name: "Ogre Chieftain", lvl: 3, exp: 165, hp: 190, hpmax: 190, n_hth: 3, n_rng: 0, hth: 28, rng: 0, def: 50, sense: 3.61, sprite: 'enemies', offset:44,
						 state: 'aggressive', spawn: ['grass','grass_pale','snow','soil','swamp_shallow'],
						 bonus_drop: [ ['bonus_sword',30], ['bonus_potion_health',50] ],
						 tile_mod: { }, obj_mod: { },
						 passable_tiles: [ "grass", "grass_pale", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud", "dirt", "sand", "water_shallow" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	'skeletonbarefist'	: { name: "Unarmed Skeleton", lvl: 0, exp: 25, hp: 24, hpmax: 24, n_hth: 2, n_rng: 0, hth: 5, rng: 0, def: 10, sense: 3.61, sprite: 'enemies', offset: 45,
						 state: 'aggressive', spawn: ['dirt', 'sand'], is_undead: true,
						tile_mod: {}, obj_mod: {},
						 bonus_drop: [ ['bonus_potion_health',50] ],
						 passable_tiles: [ "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud"  ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },

	'ghost'			: { name: "Ghost", lvl: 1, exp: 54, hp: 43, hpmax: 43, n_hth: 4, n_rng: 0, hth: 6, rng: 0, def: 50, sense: 3.61, sprite: 'enemies', offset: 46,
						 state: 'aggressive', spawn: [ 'swamp_shallow' ], regeneration: 8,
						 bonus_drop: [ ['bonus_potion_health',50] ],
						tile_mod: { }, obj_mod: {},
						 passable_tiles: [ "dirt", "swamp_shallow", "swamp_deep", "soil", "mud" ],
						 passable_objects: [ ] },

	//----------- Neutrals ---------------------------------------------------------------------------------------------------------------------
	'peasant'		: { name: "Peasant", lvl: 1, exp: 10, hp: 14, hpmax: 14, n_hth: 2, n_rng: 0, hth: 4, rng: 0, def: 0, sense: 3.61, sprite: 'neutrals', offset: 0,
						 state: 'friendly', spawn: [],
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'human_princess': { name: "Princess", lvl: 1, exp: 60, hp: 28, hpmax: 28, n_hth: 2, n_rng: 0, hth: 8, rng: 0, def: 33, sense: 3.61, sprite: 'neutrals', offset: 1,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'human_battleprincess' : { name: "Battle Princess", lvl: 2, exp: 120, hp: 42, hpmax: 42, n_hth: 3, n_rng: 0, hth: 9, rng: 0, def: 45, sense: 3.61, sprite: 'neutrals', offset: 2,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'human_queen'	: { name: "Queen", lvl: 3, exp: 170, hp: 36, hpmax: 36, n_hth: 2, n_rng: 0, hth: 6, rng: 0, def: 50, sense: 3.61, sprite: 'neutrals', offset: 3,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'elder_mage' : { name: "Elder Mage", lvl: 4, exp: 120, hp: 46, hpmax: 46, n_hth: 0, n_rng: 4, hth: 0, rng: 12, def: 40, sense: 3.61, sprite: 'neutrals', offset: 4,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ], rng_range: 5.01, rng_effect: "lightning" },
	'dwarven_runesmith'	: { name: "Dwarven Runesmith", lvl: 3, exp: 90, hp: 80, hpmax: 80, n_hth: 3, n_rng: 2, hth: 14, rng: 16, def: 60, sense: 3.61, sprite: 'neutrals', offset: 5,
						 state: 'friendly', spawn: [], rng_range: 4.25, rng_effect: "dark_missile",
						tile_mod: {}, obj_mod: { 'mountains': 20 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'dwarven_lord'	: { name: "Dwarven Lord", lvl: 4, exp: 180, hp: 96, hpmax: 96, n_hth: 4, n_rng: 0, hth: 13, rng: 0, def: 70, sense: 3.61, sprite: 'neutrals', offset: 6,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: { 'mountains': 20 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'dwarven_king'	: { name: "Dwarven King", lvl: 5, exp: 230, hp: 92, hpmax: 92, n_hth: 5, n_rng: 0, hth: 12, rng: 0, def: 80, sense: 3.61, sprite: 'neutrals', offset: 7,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: { 'mountains': 20 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'elven_princess': { name: "Elven Princess", lvl: 2, exp: 55, hp: 22, hpmax: 22, n_hth: 0, n_rng: 2, hth: 0, rng: 10, def: 20, sense: 3.61, sprite: 'neutrals', offset: 8,
						 state: 'friendly', spawn: [], rng_range: 3.61, rng_effect: "arrows_1", is_boss: true,
						tile_mod: {}, obj_mod: { 'forest_palm': 10, 'forest_coniferous': 20, 'forest_deducious': 20,
										 'forest_snow_coniferous': 20, 'forest_autumn': 20, 'forest_snow_dead': 10, 'forest_palm_desert': 10 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'monolith' ] },
	'elven_queen'	: { name: "Elven Queen", lvl: 4, exp: 130, hp: 30, hpmax: 30, n_hth: 0, n_rng: 3, hth: 0, rng: 14, def: 40, sense: 3.61, sprite: 'neutrals', offset: 9,
						 state: 'friendly', spawn: [], rng_range: 4.25, rng_effect: "arrows_2", is_boss: true,
						tile_mod: {}, obj_mod: { 'forest_palm': 20, 'forest_coniferous': 30, 'forest_deducious': 30,
										 'forest_snow_coniferous': 30, 'forest_autumn': 30, 'forest_snow_dead': 20, 'forest_palm_desert': 20 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'monolith' ] },
	'peasant_torch'	: { name: "Peasant", lvl: 1, exp: 10, hp: 14, hpmax: 14, n_hth: 2, n_rng: 0, hth: 5, rng: 0, def: 0, sense: 3.61, sprite: 'neutrals', offset:10,
						 state: 'friendly', spawn: [],
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'monolith' ] },
	'dwarven_hero'	: { name: "Dwarven Hero", lvl: 3, exp: 250, hp: 132, hpmax: 132, n_hth: 4, n_rng: 0, hth: 12, rng: 0, def: 75, sense: 3.61, sprite: 'neutrals', offset: 11,
						 state: 'friendly', spawn: [], is_boss: true,
						tile_mod: {}, obj_mod: { 'mountains': 20 },
						 passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
						 passable_objects: [ 'forest_oasis', 'mountains', 'monolith' ] },
	'unicorn'		: { name: "Unicorn", lvl: 3, exp: 150, hp: 210, hpmax: 210, n_hth: 2, n_rng: 0, hth: 8, rng: 0, def: 80, sense: 0.5, sprite: 'neutrals', offset: 12,
						 state: 'friendly', spawn: [],
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ ],
						 passable_objects: [ ] },
	'caged_unicorn'	: { name: "Caged Unicorn", lvl: 3, exp: 0, hp: 1, hpmax: 1, n_hth: 0, n_rng: 0, hth: 0, rng: 0, def: 0, sense: 0.5, sprite: 'neutrals', offset: 13,
						 state: 'neutral', spawn: [],
						tile_mod: {}, obj_mod: {},
						 passable_tiles: [ ],
						 passable_objects: [ ] }

};

GAME.Monsters.IsAlive = function( uuid ) {
	for (var i = 0, len = this.mList.length; i < len; i++) {
		if ( this.mList[i].mUUID === uuid ) { return true; }
	}
	return false;
};

GAME.Monsters.Find = function(x1,y1,x2,y2) {
	var result = [], monster, c;
	for (var i = 0, len = this.mList.length; i < len; i++) {
		monster = this.mList[i], c = monster.GetGameXY();
		if ( c.x >= x1 && c.x <= x2 && c.y >= y1 && c.y <= y2 ) { result.push(monster); }
	}
	return result;
};

GAME.Monsters.IsMonsterThere = function( x, y ) {
	var monster, c;
	for ( var i = 0, len = this.mList.length; i < len; i++ ) {
		monster = this.mList[i], c = monster.GetGameXY();
		if ( Math.abs(c.x - x) < 0.5 && Math.abs(c.y - y) < 0.5 ) { return monster; }
	}
	return false;	
};

GAME.Monsters.CreatePlayerCopy = function( x, y ) {
	var gp = GAME.player;
	var opts = {
		// entity
		'game_x': x, 'game_y': y, 'n_hth': gp.mNHTH, 'n_rng': gp.mNRNG, 'sense': 3.61, 'rng_range': gp.GetRangedRange(),
		'lvl': gp.mLVL, 'exp': 0, 'kill_exp': 0, 'hp': [ (gp.mHP[0] * 0.33), parseInt(gp.mHP[1] * 0.33) ],
		'hth': gp.mHTH, 'rng': gp.mRNG, 'def': gp.mDEF,
		'passable_tiles': gp.mPassableTiles.slice(), 'passable_objects': gp.mPassableObjects.slice(),
		// sprite
		'canvas': GAME.layer_control.GetCanvas('monsters'), 'tag_color': "#000",
		'animations': $.extend( {}, gp.mAnimations ),
		'default_animation': 'idle',
		// screen object
		'name': 'Mirror Image'
	};


	if ( gp.mIsMagicUser !== undefined ) {
		opts['is_magicuser'] = gp.mIsMagicUser;
	}

	var rng_effect = gp.GetRangedEffect();
	if ( rng_effect !== undefined ) {
		opts['rng_effect'] = $.extend( {}, rng_effect );
	}

	var monster = new WS.Entity(opts);
	monster.SetState('friendly');
	monster.SetTrait('charmed');
	monster.monster_type = 'clone';

	// update animations
    var norm_lvl_new = GAME.player.GetNormalizedLvl();
    var pr = GAME.PlayersControl.GetPreset( GAME.data['role'] );
	monster.SetAnimations( $.gmMakeStandardAnimations( 'heroes', pr.offset * 3 + norm_lvl_new ) );

	this.mList.push( monster );
	return monster;
};

GAME.Monsters.Create = function( name, x, y, is_super ) {
	is_super = ( is_super !== undefined ) ? is_super : false;

	var m = this.Get( name );
	if ( m === undefined ) {
		console.log('bad monster name: ' + name);
		throw 'unknown monster name encountered';
	}

	var difficulty = GAME.data['game_difficulty'];
	var exp_mod = 1.0;
	if ( difficulty < 1.0 ) { exp_mod -= 0.20; }
	if ( difficulty > 1.0 ) { exp_mod += 0.25; }

	var tag_color = '#F88';
	if ( m.state === 'friendly' ) { tag_color = '#9F9'; }
	else if ( m.state === 'neutral') { tag_color = '#CCC'; }
	else if ( m.state === 'angered' ) { tag_color = '#F55'; } 

	var opts = {
		// entity
		'game_x': x, 'game_y': y, 'n_hth': m.n_hth, 'n_rng': m.n_rng, 'sense': m.sense, 'rng_range': m.rng_range,
		'lvl': m.lvl, 'exp': 0, 'kill_exp': parseInt( m.exp * exp_mod ), 'hp': [ parseInt( m.hp * exp_mod ), parseInt( m.hpmax * exp_mod ) ],
		'hth': parseInt( m.hth * exp_mod ), 'rng': parseInt( m.rng * exp_mod ), 'def': parseInt( m.def * exp_mod ), 'state': m.state,
		'passable_tiles': m.passable_tiles, 'passable_objects': m.passable_objects,
		// sprite
		'canvas': GAME.layer_control.GetCanvas('monsters'), 'tag_color': tag_color,
		'animations': $.gmMakeStandardAnimations( m.sprite, m.offset ),
		'default_animation': 'idle',
		// screen object
		'name': m.name
	};

	if ( m.is_undead !== undefined ) {
		opts['is_undead'] = m.is_undead;
	}
	if ( m.is_orc !== undefined ) {
		opts['is_orc'] = m.is_orc;
	}
	if ( m.is_magicuser !== undefined ) {
		opts['is_magicuser'] = m.is_magicuser;
	}
	if ( m.bonus_drop !== undefined ) {
		opts['bonus_drop'] = m.bonus_drop;
	}

	if ( m.regeneration !== undefined ) {
		opts['regeneration'] = m.regeneration;
	}

	if ( m.poison !== undefined ) {
		opts['poison'] = m.poison;
	}

	if ( m.entangle !== undefined ) {
		opts['entangle'] = m.entangle;
	}

	if ( m.armor_piercing != undefined ) {
		opts['armor_piercing'] = m.armor_piercing;
	}

	if ( m.rng_effect !== undefined ) {
		if (  GAME.ranged_effects[ m.rng_effect ] === undefined ) { throw 'cannot find ranged effect '+m.rng_effect; }
		opts['rng_effect'] = $.extend( {}, GAME.ranged_effects[ m.rng_effect ] );
	}

	var monster = new WS.Entity(opts);

	monster.spawn = m.spawn;
	monster.move = m.move;
	monster.monster_type = name;

	if ( is_super === true ) {
		monster.mName = 'Super ' + monster.mName;
		monster.mIsBoss = true;
		monster.mHP[1] *= 3;
		monster.mHP[0] = monster.mHP[1];
		monster.mLVL += 1;
		monster.mKEXP *= 2;
		monster.mSense += 1.5;
		if ( monster.mDEF < 75 ) { monster.mDEF += 20; }
		if ( monster.mRNG > 0 ) { monster.mRNG = parseInt( monster.mRNG * 1.5 ); monster.mNRNG += 1; }
		if ( monster.mHTH > 0 ) { monster.mHTH = parseInt( monster.mHTH * 1.5 ); monster.mNHTH += 1; monster.mRngRange += 1.0; }
	}

	this.mList.push( monster );
	return monster;
};

GAME.Monsters.Destroy = function( uuid ) {
    var i = this.mList.length;
    while ( i-- ) {
		if ( this.mList[i].GetUUID() == uuid ) {
			c = this.mList[i].GetGameXY();
			this.mList.splice(i,1);
			return true;
		}
	}
	return false;
};

GAME.Monsters.GetRandomMonsterForTile = function( tile ) {
	var options = [], monster;
	for ( var i in this.mUnits ) {
		monster = this.mUnits[i];
		if ( monster.spawn.inArray(tile) == true ) {
			monster.id = i;
			options.push(monster);
		}
	}
	if ( options.length == 0 ) { return undefined; }
	return options[ $.gmRndInt(0, options.length - 1) ]; 
};

GAME.Monsters.FindInRadius = function( x0, y0, radius, states ) { // states = ['aggressive','angered']
	states = ( states !== undefined ) ? states : ['cowardly', 'friendly', 'neutral', 'aggressive', 'angered', 'sleeping', 'frenzied' ];
	var result = [], monster, c, dist;
	for ( var i = 0, len = this.mList.length; i < len; i++ ) {
		monster = this.mList[i];
		c = monster.GetGameXY();
		dist = Math.sqrt( Math.pow( x0 - c.x, 2 ) + Math.pow( y0 - c.y, 2 ) );
		if ( dist < radius && states.inArray( monster.mState ) ) { result.push( this.mList[i] ); }
	}
	return result;
};

GAME.Monsters.FindNearestMonsterInRadius = function( x0, y0, radius, states ) {
	states = ( states !== undefined ) ? states : ['cowardly', 'friendly', 'neutral', 'aggressive', 'angered', 'sleeping', 'frenzied' ];
	var result = [], nearest_dist = undefined, nearest_monster = undefined, monster, c, dist;
	for ( var i = 0, len = this.mList.length; i < len; i++ ) {
		monster = this.mList[i];
		c = monster.GetGameXY();
		dist = Math.sqrt( Math.pow( x0 - c.x, 2 ) + Math.pow( y0 - c.y, 2 ) );
		if ( dist > 0 && dist <= radius && states.inArray( monster.mState ) ) { 
			//result.push( this.mList[i] ); 
			if ( nearest_monster === undefined || dist < nearest_dist ) { 
				nearest_monster = monster; nearest_dist = dist;
			}
		}
	}
	return nearest_monster;
};

GAME.Monsters.DestroyMonstersInRadius = function( x0, y0, radius ) {
	var result = [], monster, c;
	for ( var i = 0, len = this.mList.length; i < len; i++ ) {
		monster = this.mList[i], c = monster.GetGameXY();
		var dist = Math.sqrt( Math.pow( x0 - c.x, 2 ) + Math.pow( y0 - c.y, 2 ) );
		if ( dist < radius ) { result.push( this.mList[i].GetUUID() ); }
	}
	for ( var i = 0, len = result.length; i < len; i++ ) {
		this.Destroy( result[i] );
	}
}

GAME.Monsters.CountMonsters = function() {
	var counter = 0;
	for ( var i = 0, len = this.mList.length; i < len; i++ ) {
		monster = this.mList[i];
		if ( monster.mState != 'friendly' ) {
			counter += 1;
		}
	}
	return counter;
};

