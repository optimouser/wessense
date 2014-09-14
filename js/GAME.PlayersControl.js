GAME.PlayersControl = GAME.PlayersControl || { 
	mPresets: {
    'role_1_0': { race: 'Human',class: ['Lancer','Knight','Grand Knight'], offset: 0, hp: 54, hth: 16, rng:  0, def: 20,
		 levelup: { hp: 4, hth: 2, rng: 0, def: 3 }, n_hth: 2, n_rng: 0, armor_piercing: true,
		 majorupgrade: { n_hth: 1, n_rng: 0, hp: 12, hth: 0, rng: 0, def: 5 }, max_def: 90,
         imgoff_hth: [0,-60,-60,-60,-120,-60], imgoff_rng: [-60,0,-60,0,-60,0], imgoff_def: [0,-480,-60,-480,-120,-480],
         tile_mod: { 'grass': 10 },
          obj_mod: { 'forest_oasis': 10 },
		 disable_hth: false, disable_rng: true,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis', 'monolith', 'shop_magic', 'shop_weapons' ] },

    'role_1_1': { race: 'Human',class: ['Mage','Silver Mage','Great Mage'], offset: 1, hp: 38, hth:  5, rng: 10, def: 5, rng_effects: ['icemissile','fireblast','lightning'],
         rng_range: [ 2.83, 3.61, 4.25 ], imgoff_hth: [-120,0,-120,0,-120,0], imgoff_rng: [0,-120,-60,-120,-120,-120], imgoff_def: [0,-420,-60,-420,-120,-420],
		 levelup: { hp: 2, hth: 0, rng: 1, def: 0 }, n_hth: 1, n_rng: 2,
		 majorupgrade: { n_hth: 0, n_rng: 1, hp: 8, hth: 0, rng: 0, def: 10 }, max_def: 50,
         tile_mod: { 'grass': 10 },
         obj_mod : { 'forest_oasis': 10 },
		 disable_hth: false, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis', 'monolith', 'shop_magic', 'shop_weapons'] },

    'role_2_0': { race: 'Elf',  class: ['Archer','Marksman','Sharpshooter'], offset: 2, hp: 40, hth:  0, rng: 9, def: 10, rng_effects: ['arrows_1', 'arrows_2', 'arrows_3'],
         rng_range: [ 2.83, 3.61, 4.25 ], imgoff_hth: [-60,0,-60,0,-60,0], imgoff_rng: [0,-180,-60,-180,-120,-180], imgoff_def: [0,-420,-60,-420,-120,-420],
		 levelup: { hp: 2, hth: 0, rng: 1, def: 1 }, n_hth: 0, n_rng: 2, armor_piercing: true,
		 majorupgrade: { n_hth: 0, n_rng: 1, hp: 10, hth: 0, rng: 0, def: 5 }, max_def: 65,
         tile_mod: { 'desert': -20, 'sand': -10, 'snow': -20 },
         obj_mod : { 'forest_palm': 20, 'forest_oasis': 30, 'forest_coniferous': 30, 'forest_deducious': 30, 
						'forest_snow_coniferous': 20, 'forest_autumn': 25, 'forest_snow_dead': 15 },
		 disable_hth: true, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 
			'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'monolith', 'shop_magic', 'shop_weapons'] },

    'role_2_1': { race: 'Elf',  class: ['Fighter','Hero','Champion'], offset: 3, hp: 44, hth: 7, rng:  0, def: 15,
         imgoff_hth: [0,-240,-60,-240,-120,-240], imgoff_rng: [-60,0,-60,0,-60,0], imgoff_def: [0,-480,-60,-480,-120,-480],
		 levelup: { hp: 3, hth: 1, rng: 0, def: 2 }, n_hth: 3, n_rng: 0,
		 majorupgrade: { n_hth: 1, n_rng: 0, hp: 12, hth: 0, rng: 0, def: 5 }, max_def: 80,
         tile_mod: { 'desert': -20, 'sand': -5, 'snow': -10 },
         obj_mod : { 'forest_palm': 20, 'forest_oasis': 30, 'forest_coniferous': 30, 'forest_deducious': 30, 
						'forest_snow_coniferous': 20, 'forest_autumn': 25, 'forest_snow_dead': 15 },
		 disable_hth: false, disable_rng: true,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis','forest_palm', 'forest_coniferous', 
			'forest_deducious', 'forest_snow_dead', 'forest_autumn', 'forest_palm_desert', 'forest_snow_coniferous', 'monolith', 'shop_magic', 'shop_weapons'] },

    'role_3_0': { race: 'Dwarf',class: ['Scout','Pathfinder','Explorer'], offset: 4, hp: 62, hth: 10, rng:  4, def: 15, rng_effects: ['hatchet','battleaxe','battleaxe'],
         rng_range: [ 3.61, 3.61, 3.61 ], imgoff_hth: [0,-300,-60,-300,-120,-300], imgoff_rng: [-60,0,-60,0,-60,0], imgoff_def: [0,-480,-60,-480,-120,-480],
		 levelup: { hp: 3, hth: 1, rng: 0, def: 2 }, n_hth: 2, n_rng: 2,
		 majorupgrade: { n_hth: 1, n_rng: 1, hp: 14, hth: 2, rng: 4, def: 5 }, max_def: 75,
         tile_mod: { 'water_medium': -20, 'water_shallow': -10, 'desert': -10 },
         obj_mod : { 'forest_oasis': 20, 'mountains': 30 },
		 disable_hth: false, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis','mountains','monolith', 'mine', 'shop_magic', 'shop_weapons' ] },

    'role_3_1': { race: 'Dwarf',class: ['Thunderer','Thunderguard','Dragonguard'], offset: 5, hp: 52, hth:  6, rng: 18, def: 15, rng_effects: ['muzzle_1','muzzle_2','muzzle_2'],
         rng_range: [ 3.61, 4.25, 5.01 ], imgoff_hth: [0,0,0,0,0,0], imgoff_rng: [0,-360,-60,-360,-120,-360], imgoff_def: [0,-480,-60,-480,-120,-480],
		 levelup: { hp: 4, hth: 0, rng: 1, def: 1 }, n_hth: 1, n_rng: 1,
		 majorupgrade: { n_hth: 1, n_rng: 1, hp: 14, hth: 0, rng: 0, def: 5 }, max_def: 75,
         tile_mod: { 'water_medium': -20, 'water_shallow': -10, 'desert': -10 },
         obj_mod : { 'forest_oasis': 20, 'mountains': 30 },
		 disable_hth: false, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis', 'mountains','monolith', 'mine', 'shop_magic', 'shop_weapons'] },

    'role_4_0': { race: 'Human',  class: ['Thief','Rogue','Assassin'], offset: 6, hp: 32, hth:  3, rng: 2, def: 15, rng_effects: ['dagger', 'dagger', 'dagger'],
         rng_range: [ 2.83, 3.61, 4.25 ], imgoff_hth: [0,-1140,0,-1140,0,-1140], imgoff_rng: [-60,-1140,-120,-1140,-120,-1140], imgoff_def: [-120,-420,-120,-420,-120,-420],
		 levelup: { hp: 2, hth: 1, rng: 1, def: 0 }, n_hth: 3, n_rng: 4,
		 majorupgrade: { n_hth: 1, n_rng: 1, hp: 8, hth: 0, rng: 0, def: 5 }, max_def: 55,
         tile_mod: { 'desert': -10, 'snow': -10 },
         obj_mod : { 'forest_palm': 15, 'forest_oasis': 25, 'forest_coniferous': 25, 'forest_deducious': 25, 
						'forest_snow_coniferous': 15, 'forest_autumn': 20, 'forest_snow_dead': 10, 'mountain': 30 },
		 disable_hth: false, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: ['forest_oasis','forest_palm', 'forest_coniferous', 'forest_deducious', 
			'forest_snow_coniferous', 'forest_autumn', 'forest_snow_dead', 'forest_palm_desert', 'mountains', 'monolith', 'shop_magic', 'shop_weapons'] },

    'role_4_1': { race: 'Human',class: ['Cavalryman','Dragoon','Cavalier'], offset: 7, hp: 54, hth: 9, rng:  8, def: 20, rng_effects: ['arrows_1', 'arrows_1', 'arrows_1'],
		 rng_range: [ 2.83, 3.61, 4.25 ], levelup: { hp: 4, hth: 1, rng: 1, def: 2 }, n_hth: 3, n_rng: 1, armor_piercing: false,
		 majorupgrade: { n_hth: 1, n_rng: 0, hp: 10, hth: 0, rng: 0, def: 5 }, max_def: 90,
         imgoff_hth: [0,-1200,-60,-1200,-120,-1200], imgoff_rng: [0,-1260,-60,-1260,-120,-1260], imgoff_def: [0,-480,-60,-480,-120,-480],
         tile_mod: { },
          obj_mod: { 'forest_oasis': 10 },
		 disable_hth: false, disable_rng: false,
         passable_tiles: [ "water_medium", "water_shallow", "sand", "dirt", "grass", "grass_pale", "desert", "swamp_shallow", "swamp_deep", "cobblestone", "soil", "snow", "mud" ],
         passable_objects: [ 'forest_oasis', 'monolith', 'shop_magic', 'shop_weapons' ] }
	}

};

GAME.PlayersControl.GetPreset = function( role ) {
	return ( this.mPresets[ role ] !== undefined ) ? this.mPresets[ role ] : {};
};

GAME.PlayersControl.GetLvlExp = function( lvl ) {
    return 25 * ( 3 * ( lvl + 1 ) + 2 ) * lvl;
};
