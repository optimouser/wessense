
GAME.MapGen = GAME.MapGen || { 
	REVISION: '1',
	mDX: 512,
	mDY: 512,
	mMapSizeFactor : 1.0, // 1.0  = large,  1.2 = medium,   1.35 = small
	mResourceFactor: 1.0, // 0.5  = normal, 1.0 = abundant, 2.0  = a lot of resources
	mMonstersFactor: 1.0, // 0.75 = normal, 1.0 = abundant, 1.5  = a lot of monsters
	mSeed: Math.random()
};

GAME.MapGen.Generate = function() {

	GAME.CreateEffects();

	Math.seedrandom(this.mSeed);
	var that = this;
	this.mMask = new Float32Array(this.mDX * this.mDY);
	this.mLakeMask = new Float32Array(this.mDX * this.mDY); // 0 = nothing, 1 = swamp, 2 = ocean, 5 = rocks, 6 = mountains, 7 = deserts

	this.mTileMap 	 = $.gmMatrix(this.mDX, this.mDY); // tile only
	this.mTerrainMap = $.gmMatrix(this.mDX, this.mDY); // forest, mountains, decorations
	this.mBloodMap 	 = $.gmMatrix(this.mDX, this.mDY); // blood stains
	this.mObjMap 	 = $.gmMatrix(this.mDX, this.mDY); // pickable object(s) = multi-object cells
	// order or rendering: tile, terrain, blood, objects

	this.GenerateMask();

	amplify.subscribe('WORLD_MASK_GENERATED', function() {
		that.FindLakes();
		that.GenerateLand();
	});
	amplify.subscribe('LAND_GENERATED', that, that.GenerateSwamps);
	amplify.subscribe('SWAMPS_GENERATED', that, that.GenerateObjects);
	amplify.subscribe('OBJECTS_GENERATED', that, that.GenerateMonsters);
	amplify.subscribe('MONSTERS_GENERATED', function() {
		amplify.publish('MAP_GENERATION_COMPLETE');
	});

};

GAME.MapGen.GetTile = function( x, y ) {
	return this.mTileMap[x][y];
};

GAME.MapGen.GetTerrainObject = function( x, y ) {
	return this.mTerrainMap[x][y];
};

GAME.MapGen.mBoundaries = [
    [  95, 'water_deep' ],
    [ 100, 'water_medium' ],
    [ 108, 'water_shallow' ],
    [ 114, 'sand' ],
    [ 120, 'dirt' ],
    [ 140, 'grass' ],
    [ 155, 'mud' ],
    [ 163, 'soil' ],
    [ 180, 'snow' ],
    [ 186, 'cobblestone' ],
    [ 194, 'lava' ],
    [ 500, 'mud' ]
];

GAME.MapGen.mDetails = {
	'water_medium': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'whirlpool' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'sunken_huts' }
	],

	'water_shallow': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.01, type: 'bonus_barrel_floating' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.01, type: 'deco_swamp_lilies' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.01, type: 'deco_stones' }
	],

	'sand': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0005, type: 'bonus_armor' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0001, type: 'bonus_armor_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_blue' },
		{ mask_min: 109, mask_max: 113, rnd_min: 0, rnd_max: 0.02, type: 'forest_oasis' },
		{ mask_min: 109, mask_max: 113, rnd_min: 0, rnd_max: 0.03, type: 'deco_debris' },
		{ mask_min: 109, mask_max: 113, rnd_min: 0, rnd_max: 0.01, type: 'house_tent' },
		{ mask_min: 109, mask_max: 113, rnd_min: 0, rnd_max: 0.07, type: 'forest_palm' }
	],

	'desert': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.004, type: 'bonus_armor' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_armor_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.003, type: 'bonus_gold_large' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.002, type: 'bonus_potion_health' },	
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.002, type: 'bonus_book_necro' },	

		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'bonus_potion_blue' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'bonus_scroll_yellow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'bonus_scroll_cyan' },

		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0010, type: 'shop_weapons' }, 
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0010, type: 'shop_magic' }, 

		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.01, type: 'house_desert' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.04, type: 'forest_palm_desert' }
	],

	'swamp_shallow': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_chest_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_medium' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.003, type: 'bonus_scroll_yellow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.03, type: 'deco_swamp_lilies' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.03, type: 'deco_swamp_lilies_flowers' },
		{ mask_min: 0, mask_max: 114, rnd_min: 0, rnd_max: 0.01, type: 'house_swamp' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.25, type: 'deco_swamp_grass' }
	],

	'swamp_deep': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_chest_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_armor' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_armor_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.002, type: 'bonus_gold_large' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book_necro' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_poison' }
	],
	'grass': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },

		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_potion_blue' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_potion_green' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_scroll_red' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_scroll_purple' },

		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'monolith' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'deco_stones_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'bonus_mushrooms' },
		{ mask_min: 50, mask_max: 135, rnd_min: 0, rnd_max: 0.05, type: 'deco_flowers' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0010, type: 'shop_weapons' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0010, type: 'shop_magic' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0035, type: 'house_elf' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0015, type: 'house_elf_lights' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0035, type: 'house_human_hut' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.25, type: 'forest_deducious' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.25, type: 'forest_coniferous' },
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.1, type: 'forest_autumn' }
	],
	'grass_pale': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.005, type: 'monolith' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'deco_stones_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'bonus_mushrooms' },
		{ mask_min: 50, mask_max: 135, rnd_min: 0, rnd_max: 0.05, type: 'deco_flowers' },
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0035, type: 'house_elf' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.0035, type: 'house_human_hut' }, 
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.25, type: 'forest_deducious' },
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.25, type: 'forest_coniferous' },
		{ mask_min: 122, mask_max: 135, rnd_min: 0, rnd_max: 0.1, type: 'forest_autumn' }
	],

	'dirt': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_yellow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_heal' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.1, type: 'deco_stones' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.025, type: 'stones_large' }
	],
	
	'mud': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.002, type: 'bonus_gold_medium' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.002, type: 'bonus_armor' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0004, type: 'bonus_armor_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.003, type: 'mine' },
		{ mask_min: 100, mask_max: 190, rnd_min: 0, rnd_max: 0.0025, type: 'house_dwarf' }, 
		{ mask_min: 100, mask_max: 190, rnd_min: 0, rnd_max: 0.0025, type: 'house_stone' }, 
		{ mask_min: 100, mask_max: 190, rnd_min: 0, rnd_max: 0.5, type: 'mountains' }
	],

	'soil': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_yellow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_red' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_heal' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 100, mask_max: 138, rnd_min: 0, rnd_max: 0.05, type: 'bonus_mushrooms_large' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'deco_stones_small' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'bonus_mushrooms' },
		{ mask_min: 0, mask_max: 114, rnd_min: 0, rnd_max: 0.025, type: 'house_swamp' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.1, type: 'bonus_mushrooms_large' }
	],

	'snow': [
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_armor' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0002, type: 'bonus_armor_gold' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_gold_medium' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_health' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_book' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_sword' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_lance' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_bow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_axe' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_staff' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_red' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_yellow' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_scroll_cyan' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.001, type: 'bonus_potion_heal' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0010, type: 'shop_weapons' },
		{ mask_min: 0, mask_max: 500, rnd_min: 0, rnd_max: 0.0010, type: 'shop_magic' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.01, type: 'monolith' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.03, type: 'forest_snow_dead' },
		{ mask_min: 100, mask_max: 500, rnd_min: 0, rnd_max: 0.05, type: 'forest_snow_coniferous' }
	]
};

GAME.MapGen.FindObjTypeFromTileMaskValue = function(tile, mask_value) {
	var params = this.mDetails[tile];
    if (params == undefined) { return undefined; }
    var size_factor = this.mMapSizeFactor, resource_factor = this.mResourceFactor;
    var parset = undefined, rnd = undefined;
    for (var i = 0, len = params.length; i < len; i++) {
        parset = params[i];
        if ( mask_value < (parset.mask_min * size_factor) || mask_value > (parset.mask_max * size_factor) ) { continue; }
        rnd = $.gmRnd(0.0, 1.0);
        if ( ( rnd < (parset.rnd_min * resource_factor) || rnd > ( parset.rnd_max * resource_factor ) ) ) { continue; }
		return parset.type;
		//return { 't': parset.type, 'v': $.gmRndInt(0,GAME.Objects.Get(parset.type).length - 1) };
    }
	return undefined;
};

GAME.MapGen.FindTileTypeFromMaskValue = function(val) {
    var bounds = this.mBoundaries, size_factor = this.mMapSizeFactor;
    for (var i = 0, len = bounds.length; i < len; i++) {
        if ( val < ( bounds[i][0] * size_factor ) ) {
            return bounds[i][1];
        }
    }
    console.error('ERROR: unknown mask value: '+ val);
    return undefined;
};


GAME.MapGen.GenerateMask = function() {
	var that = this;
	noise.seed(Math.random());
	var sizefactor = this.mMapSizeFactor;
	/*
	var chunks = [ 
		0, this.mDX / 4, 
		this.mDX / 4, this.mDX / 2, 
		this.mDX / 2, this.mDX * 3 / 4, 
		this.mDX * 3 / 4, this.mDX 
	];
	*/
	var chunks = [
		0, this.mDX / 8,
		this.mDX / 8, this.mDX / 4,
		this.mDX / 4, this.mDX * 3 / 8,
		this.mDX * 3 / 8, this.mDX / 2,
		this.mDX / 2, this.mDX * 5 / 8,
		this.mDX * 5 / 8, this.mDX * 3 / 4,
		this.mDX * 3 / 4, this.mDX * 7 / 8,
		this.mDX * 7 / 8, this.mDX
	];

	var chunks_start_length = chunks.length;
	var ns = function(x, y, scale) { return ((noise.perlin2(x / scale, y / scale) + 1.0) / 2.0) * 256.0; };
	var dx2 = this.mDX / 2, dy2 = this.mDY / 2;
    var process_mask = function() {
		amplify.publish('WORLD_MASK_GENERATION_PROGRESS', Math.round( ( chunks_start_length - chunks.length ) / chunks_start_length * 100.0 ) );
        if (chunks.length <= 0) {
            amplify.publish( "WORLD_MASK_GENERATED");
            return;
        }
        var x_stop = chunks.pop();
        var x_start = chunks.pop();
        for (var x = x_start; x < x_stop; x++) {
            for (var y = 0, leny = that.mDY; y < leny; y++) {
                pos = x + y * that.mDX;
                value = ns(x,y,64) / 2.0 + ns(x,y,32) / 4.0 + ns(x,y,16) / 8.0 + ns(x,y,8) / 16.0 + ns(x,y,4) / 32.0 + ns(x,y,2) / 64.0 + ns(x,y,1) / 128.0;
                if (value > 255) { value = 255; }
                value = ( Math.abs( that.mDX - Math.sqrt((dx2-x)*(dx2-x)+(dy2-y)*(dy2-y)) ) ) / that.mDY * 1.25 * value;
                that.mMask[pos] = value;
				if ( value <= 114 * sizefactor ) {		 // lakes
					that.mLakeMask[pos] = 1; 
				} else if ( value > 140 * sizefactor ) {  // mountains / deserts
					that.mLakeMask[pos] = 5;
				} else {
					that.mLakeMask[pos] = 0;
				}
            }
        }
        setTimeout(process_mask, 5);
    };
    process_mask();
};

GAME.MapGen.FindLakes = function() {
	var map = this.mLakeMask;
	// find ocean / swamps:
	this.FloodFill(map, 1, 1, 1, 2); // mark outer region as ocean, remaining areas is swamps

	// find mountain / deserts:
	if ( map[256 + 512*256] == 5 ) {
		this.FloodFill(map, 256, 256, 5, 6); // mark central part as mountain, remaining areas are deserts
	} else {
		//scan for nearest mountain in x 
		var found = false
		for (var x = 200; x < 356; x++) {
			if ( map[x + 512*256] == 5 ) {
				this.FloodFill(map, x, 256, 5, 6);
				found = true;
				break;
			}
		}
		if ( found == false ) {
		for (var y = 200; y < 356; y++) {
			if ( map[256 + 512*y] == 5 ) {
				this.FloodFill(map, 256, y, 5, 6);
				found = true;
				break;
			}
		}
		}
	}

};

GAME.MapGen.GenerateLand = function() {
    var tilemap = this.mTileMap, mask = this.mMask, lakes = this.mLakeMask;
	var size_factor = this.mMapSizeFactor, dx = this.mDX;
    for (var x = 0, lenx = dx; x < lenx; x++) {
        for (var y = 0, leny = this.mDY; y < leny; y++) {
			var mvalue = mask[ x + y * dx ]; // mask value
            tilemap[x][y] = this.FindTileTypeFromMaskValue( mvalue );
			if ( lakes[x + y*this.mDX] == 1 ) { // swamp!
				tilemap[x][y] = 'swamp_shallow';
				if ( mvalue > ( 102 * size_factor ) && mvalue < ( 104 * size_factor ) ) {
					tilemap[x][y] = 'soil';
				} else if ( mvalue < ( 97 * size_factor ) ) { 
					if ( $.gmRndInt(0,100) < 20 ) { 
						tilemap[x][y] = 'soil';
					} else {
						tilemap[x][y] = 'swamp_deep';
					}
				}
			} else if ( lakes[x + y * dx] == 5 ) { // desert!
				if ( mvalue > ( 170 * size_factor ) ) {
					tilemap[x][y] = 'dirt';
				} else if ( mvalue > ( 165 * size_factor ) ) {
					tilemap[x][y] = 'sand';
				} else if ( mvalue > ( 160 * size_factor ) ) {
					tilemap[x][y] = 'lava';
				} else if ( mvalue > ( 148 * size_factor ) ) {
					tilemap[x][y] = 'desert';
				} else if ( mvalue > ( 145 * size_factor ) ) {
					tilemap[x][y] = 'sand';
				} else {
					tilemap[x][y] = 'dirt';
				}
			}
        }
        if ( (x + 1) % 64 == 0 ) {
            amplify.publish('LAND_GENERATION_PROGRESS', Math.round(  (x + 1)  / dx * 100.0 ) );
        }
    }
	amplify.publish('LAND_GENERATED');
};

GAME.MapGen.GenerateSwamps = function() {
	var tilemap = this.mTileMap
    for (var x = this.mDX/4, lenx = this.mDX - this.mDX/4; x < lenx; x++) {
        for (var y = this.mDY/4, leny = this.mDY - this.mDY/4; y < leny; y++) {
			if ( $.gmRndInt(0,1000) < 5 
					&& tilemap[x-1][y].startsWith('grass') 
					&& tilemap[x+1][y].startsWith('grass') 
					&& tilemap[x][y-1].startsWith('grass') 
					&& tilemap[x][y+1].startsWith('grass') ) {
				tilemap[x][y] = 'water_shallow';
				if ($.gmRndInt(0,100) < 20) { tilemap[x+1][y] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x-1][y] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x][y+1] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x][y-1] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x+1][y+1] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x-1][y-1] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x-1][y+1] = 'water_shallow'; }
				if ($.gmRndInt(0,100) < 20) { tilemap[x+1][y-1] = 'water_shallow'; }
			}
		}
        if ( (x + 1) % 64 == 0 ) {
            amplify.publish('SWAMPS_GENERATION_PROGRESS', Math.round(  (x + 1)  / ( this.mDX - this.mDX / 4 ) * 100.0 ) );
        }
	}
	amplify.publish('SWAMPS_GENERATED');
};

GAME.MapGen.GenerateObjects = function() {
    var objmap = this.mTerrainMap, tilemap = this.mTileMap, mask = this.mMask, type;
	var gobjects = GAME.Objects;
	var dx = this.mDX, obj;
    for (var x = 0, lenx = dx; x < lenx; x++) {
        for (var y = 0, leny = dx; y < leny; y++) {
            //objmap[x][y] = this.FindObjTypeFromTileMaskValue( tilemap[x][y], mask[ x + y * dx ] );
            objtype = this.FindObjTypeFromTileMaskValue( tilemap[x][y], mask[ x + y * dx ] );
			if ( objtype != undefined ) {
				obj = gobjects.CreateAt( objtype, x, y );
				if ( ( ['forest_oasis', 'deco_debris', 'stones_large', 'forest_palm', 'forest_palm_desert', 'bonus_mushrooms', 'monolith'].inArray(objtype) || objtype.startsWith('deco_stones') )
					&& this.IsObjectNearby(x,y) == true ) { objmap[x][y] = undefined; }
				if ( ['forest_oasis','deco_debris','forest_palm'].inArray(objtype) && this.IsTileTypeNearby(x,y,['water_shallow']) == true ) { objmap[x][y] = undefined; }
				if ( objtype.startsWith('house') ) {
					if ( this.IsObjectNearbyStartsWith(x,y,'house') ) { 
						gobjects.DestroyTerrain(x,y); 
					} else {
						GAME.data['houses'] += 1;
					}
				} else if ( objtype === 'monolith' ) { 
					GAME.data['monoliths'] += 1;
				} else if ( objtype === 'mine' ) { 
					obj.mudcrawler_released = false; 
					GAME.data['mines'] += 1;
				} else if ( objtype === 'shop_magic' ) {
					if ( this.IsObjectNearbyStartsWith(x,y,'shop') ) { 
						gobjects.DestroyTerrain(x,y); 
					} else {
						GAME.data['shops']['magic'] += 1;
					}
				} else if ( objtype === 'shop_weapons' ) {
					if ( this.IsObjectNearbyStartsWith(x,y,'shop') ) { 
						gobjects.DestroyTerrain(x,y); 
					} else {
						GAME.data['shops']['weapons'] += 1;
					}
				}
			}
        }
        if ( (x + 1) % 64 == 0 ) {
            amplify.publish('OBJECTS_GENERATION_PROGRESS', Math.round(  (x + 1)  / dx * 100.0 ) );
        }
    }
	console.log('shops / magic: ' + GAME.data['shops']['magic'] );
	console.log('shops / weapons: ' + GAME.data['shops']['weapons'] );
	amplify.publish('OBJECTS_GENERATED');
};

GAME.MapGen.GenerateMonsters = function() {

	this.GenerateQuestItems(); // do it just before monster placement, to avoid collisions

	var total_exp = 0, supermonsters = 0;
	var dx = this.mDX, dy = this.mDY, data = this.mTileMap, objs = this.mTerrainMap, tile, monster, monster_rnd = undefined;
	for (var x = 0; x < dx; x++) {
		for (var y = 0; y < dy; y++) {
			tile = data[x][y]; monster_rnd = $.gmRnd(0,100.0);
			if ( ( ( monster_rnd <= ( 1.35 * this.mMonstersFactor ) ) && objs[x][y] === undefined ) 
				|| ( ( monster_rnd <= ( 3.0 * this.mMonstersFactor ) ) && ( tile === 'swamp_shallow' || tile === 'swamp_deep' ) ) ) {
				monster = GAME.Monsters.GetRandomMonsterForTile(tile);
				if ( monster == undefined ) { continue; }
				if ( !monster.name.startsWith('Mermaid') && $.gmRndInt(0,15) === 15 ) {
					monster = GAME.Monsters.Create( monster.id, x, y, true );
					supermonsters += 1;
				} else {
					monster = GAME.Monsters.Create( monster.id, x, y, false );
				}
				total_exp += monster.mKEXP;
			}
		}
		if ( (x + 1) % 64 == 0 ) { 
			amplify.publish('MONSTERS_GENERATION_PROGRESS', Math.round(  (x + 1)  / dx * 100.0 ) );
		}
	}
	console.log( GAME.Monsters.mList.length + ' monsters generated, for a total of ' + total_exp + ' exp');
	console.log( 'Super monsters generated: ' + supermonsters );
	console.log(' To advance to lvl 30, character needs ' + ( 25 * ( 3 * ( 31 + 1 ) + 2 ) * 31 ) + ' exp');

	amplify.publish('MONSTERS_GENERATED');
};

GAME.MapGen.IsQuestItemNearby = function( x, y ) {
	var gd = GAME.data;
	if ( gd['position_necklace'] !== undefined && Math.abs( gd['position_necklace'].x - x ) <= 5 && Math.abs( gd['position_necklace'] - y ) <= 5 ) { return true; }
	if ( gd['position_tower'] !== undefined && Math.abs( gd['position_tower'].x - x ) <= 5 && Math.abs( gd['position_tower'] - y ) <= 5 ) { return true; }
	if ( gd['position_tower_key'] !== undefined && Math.abs( gd['position_tower_key'].x - x ) <= 5 && Math.abs( gd['position_tower_key'] - y ) <= 5 ) { return true; }
	if ( gd['position_potion_of_youth'] !== undefined && Math.abs( gd['position_potion_of_youth'].x - x ) <= 5 && Math.abs( gd['position_potion_of_youth'] - y ) <= 5 ) { return true; }
	if ( gd['position_flamingsword'] !== undefined && Math.abs( gd['position_flamingsword'].x - x ) <= 5 && Math.abs( gd['position_flamingsword'] - y ) <= 5 ) { return true; }
	if ( gd['position_evil_boss'] !== undefined && Math.abs( gd['position_evil_boss'].x - x ) <= 5 && Math.abs( gd['position_evil_boss'] - y ) <= 5 ) { return true; }
	if ( gd['position_orc_boss'] !== undefined && Math.abs( gd['position_orc_boss'].x - x ) <= 5 && Math.abs( gd['position_orc_boss'] - y ) <= 5 ) { return true; }
	if ( gd['position_unicorn'] !== undefined && Math.abs( gd['position_unicorn'].x - x ) <= 5 && Math.abs( gd['position_unicorn'] - y ) <= 5 ) { return true; }
	return false;
};

GAME.MapGen.SearchRadius = function( x_start, y_start, target_tiles ) {
	var objs = this.mTerrainMap, tiles = this.mTileMap;
	var pcoord = ( GAME.player !== undefined ) ? GAME.player.GetGameXY() : { x: 0, y: 0 };
	// search in squares
	var round = 0, xleft, xright, yleft, yright;
	for ( var round = 0; round < 256; round++ ) {
		xleft 	= x_start - round; 
		xright 	= x_start + round;
		yleft 	= y_start - round;
		yright 	= y_start + round;		
		if ( xleft > 0 && xright < 512 && yleft > 0 && yright < 512 ) {
			for ( var y = yleft; y <= yright; y++ ) {
				// fixed x: xleft, xright	
				if ( objs[xleft][y] === undefined ) {
					if ( target_tiles.inArray( tiles[xleft][y] ) && GAME.Monsters.IsMonsterThere(xleft, y) === false 
						&& !( pcoord.x === xleft && pcoord.y === y ) ) { return {'x': xleft, 'y': y }; }
				}
				if ( objs[xright][y] === undefined ) {
					if ( target_tiles.inArray( tiles[xright][y] ) && GAME.Monsters.IsMonsterThere(xright, y) === false
						&& !( pcoord.x === xright && pcoord.y === y ) ) { return {'x': xright, 'y': y }; }
				}
			}
			for ( var x = xleft; x <= xright; x++) {
				// fixed y: yleft, yright
				if ( objs[x][yleft] === undefined ) {
					if ( target_tiles.inArray( tiles[x][yleft] ) && GAME.Monsters.IsMonsterThere(x, yleft) === false 
						&& !( pcoord.x === x && pcoord.y === yleft ) ) { return {'x': x, 'y': yleft }; }
				}
				if ( objs[x][yright] === undefined ) {
					if ( target_tiles.inArray( tiles[x][yright] ) && GAME.Monsters.IsMonsterThere(x, yright) === false 
						&& !( pcoord.x === x && pcoord.y === yright ) ) { return {'x': x, 'y': yright }; }
				}
			}
		}
	}
	// bad, no tile found..
	return undefined;
};

GAME.MapGen.ClearQuestPosition = function( xst, yst, min, max ) {
	if ( min === undefined ) { min = -2; }
	if ( max === undefined ) { max =  2; }
	tile = GAME.Tiles.GetAtXY( xst, yst );
	for ( var x = min; x <= max; x++ ) {
		for ( var y = min; y <= max; y++ ) {
			if ( ( x === 0 && y === 0 ) 
				|| ( x === min && y === min ) || ( x === max && y === min ) 
				|| ( x === min && y === max ) || ( x === max && y === max ) ) 
			{ continue; }
			this.mTerrainMap[xst+x][yst+y] = undefined;
			GAME.Tiles.SetAtXY( tile, xst+x, yst+y ); 
		}
	}
};

GAME.MapGen.GenerateQuestItems = function() {

	// create quest items:
	var pos_necklace = undefined, pos_book = undefined, pos_potion = undefined, pos_flamingsword = undefined; 
	var pos_key = undefined, pos_thor_hammer = undefined, pos_tower = undefined;
	var pos_evilboss = undefined, pos_orcboss = undefined, pos_unicorn = undefined;

	do {
		pos_necklace = this.SearchRadius( $.gmRndInt(128,384), $.gmRndInt(128,384), [ 'grass', 'grass_pale' ] );
	} while ( this.IsQuestItemNearby(pos_necklace.x, pos_necklace.y) === true );
	GAME.Objects.CreateAt('bonus_necklace', pos_necklace.x, pos_necklace.y );
	GAME.data['position_necklace'] 	= pos_necklace;

	do {
		pos_book = this.SearchRadius( $.gmRndInt( 256 - 50, 256 + 50 ), $.gmRndInt( 256 - 50, 256 + 50 ), [ 'mud', 'soil','snow' ] );
	} while ( this.IsQuestItemNearby( pos_book.x, pos_book.y ) === true );
	GAME.Objects.CreateAt('bonus_book_postament', pos_book.x, pos_book.y );
	GAME.data['position_book_postament'] = pos_book;

	do {
		pos_flamingsword = this.SearchRadius( $.gmRndInt( 256 - 50, 256 + 50 ), $.gmRndInt( 256 - 50, 256 + 50 ), [ 'mud', 'soil','snow', 'grass', 'dirt', 'swamp_shallow' ] );
	} while ( this.IsQuestItemNearby( pos_flamingsword.x, pos_flamingsword.y ) === true );
	GAME.Objects.CreateAt('bonus_flamingsword', pos_flamingsword.x, pos_flamingsword.y );
	this.ClearQuestPosition( pos_flamingsword.x, pos_flamingsword.y );
	GAME.Monsters.Create( 'highwayman', pos_flamingsword.x, pos_flamingsword.y - 1);
	GAME.Monsters.Create( 'highwayman',	pos_flamingsword.x, pos_flamingsword.y + 1);
	GAME.Monsters.Create( 'thief', 		pos_flamingsword.x + 1, pos_flamingsword.y);
	GAME.Monsters.Create( 'duelist', 	pos_flamingsword.x - 1, pos_flamingsword.y);
	GAME.data['position_flamingsword'] = pos_flamingsword;

	if ( GAME.data['role'] === 'role_1_0' || GAME.data['role'] === 'role_1_1' ) {
		do {
			pos_potion = this.SearchRadius( $.gmRndInt(128,384), $.gmRndInt(128,384), [ 'grass','grass_pale', 'swamp_shallow', 'mud', 'dirt' ] );
		} while ( this.IsQuestItemNearby(pos_potion.x, pos_potion.y) === true );
		this.ClearQuestPosition( pos_potion.x, pos_potion.y );
		GAME.Objects.CreateAt('bonus_potion_youth', pos_potion.x, pos_potion.y );
		GAME.Monsters.Create( 'troll', 	pos_potion.x - 1, pos_potion.y - 1);
		GAME.Monsters.Create( 'troll',	pos_potion.x + 1, pos_potion.y + 1);
		GAME.Monsters.Create( 'troll_shaman', 	pos_potion.x + 1, pos_potion.y - 1);
		GAME.Monsters.Create( 'troll_yelp', 	pos_potion.x - 1, pos_potion.y + 1);
		GAME.data['position_potion_of_youth'] = pos_potion;
	}	

	do {
		pos_key = this.SearchRadius( $.gmRndInt(128,384), $.gmRndInt(128,384), [ 'swamp_shallow', 'mud', 'dirt', 'soil', 'snow' ] );
	} while ( this.IsQuestItemNearby(pos_key.x, pos_key.y) === true );
	GAME.Objects.CreateAt('bonus_key', pos_key.x, pos_key.y );
	GAME.data['position_tower_key'] = pos_key;

	do {
		pos_tower = this.SearchRadius( $.gmRndInt(100,412), $.gmRndInt(100,412), [ 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
	} while ( this.IsQuestItemNearby(pos_tower.x, pos_tower.y) === true );
	this.ClearQuestPosition( pos_tower.x, pos_tower.y );
	GAME.Objects.CreateAt( 'bonus_orc_tower', pos_tower.x, pos_tower.y );
	GAME.data['position_tower'] = pos_tower;
	GAME.Monsters.Create( 'death_knight', 	pos_tower.x - 1, pos_tower.y - 1);
	GAME.Monsters.Create( 'death_knight',	pos_tower.x + 1, pos_tower.y + 1);
	GAME.Monsters.Create( 'bone_shooter', 	pos_tower.x + 1, pos_tower.y - 1);
	GAME.Monsters.Create( 'bone_shooter', 	pos_tower.x - 1, pos_tower.y + 1);

	// Log:
//	console.log( 'queen\'s necklace:' + pos_necklace.x + ',' + pos_necklace.y );
//	console.log( 'dwarven book:' + pos_book.x + ',' + pos_book.y );
//	console.log( 'tower:' + pos_tower.x + ',' + pos_tower.y );
//	console.log( 'tower key:' + pos_key.x + ',' + pos_key.y );
//	if ( GAME.data['role'] === 'role_1_0' || GAME.data['role'] === 'role_1_1' ) {
//		console.log( 'potion of youth:' + pos_potion.x + ',' + pos_potion.y );
//	}

	// create quest monsters:
	do {
		pos_evilboss = this.SearchRadius( $.gmRndInt(120,392), $.gmRndInt(120,392), [ 'swamp_deep', 'swamp_shallow', 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
	} while ( this.IsQuestItemNearby(pos_evilboss.x, pos_evilboss.y) === true );
	this.ClearQuestPosition( pos_evilboss.x, pos_evilboss.y );
	// make castle:
	GAME.Objects.CreateAt('castle_tl', pos_evilboss.x - 1, pos_evilboss.y - 1 );
	GAME.Objects.CreateAt('castle_t', pos_evilboss.x, pos_evilboss.y - 1 );
	GAME.Objects.CreateAt('castle_tr', pos_evilboss.x + 1, pos_evilboss.y - 1 );
	GAME.Objects.CreateAt('castle_l', pos_evilboss.x - 1, pos_evilboss.y);
	GAME.Objects.CreateAt('castle_c', pos_evilboss.x, pos_evilboss.y);
	GAME.Objects.CreateAt('castle_r', pos_evilboss.x + 1, pos_evilboss.y);
	GAME.Objects.CreateAt('castle_bl', pos_evilboss.x - 1, pos_evilboss.y + 1 );
	GAME.Objects.CreateAt('castle_b', pos_evilboss.x, pos_evilboss.y + 1 );
	GAME.Objects.CreateAt('castle_br', pos_evilboss.x + 1, pos_evilboss.y + 1 );

	// position boss:
	GAME.data['position_evil_boss'] = pos_evilboss;
	var evil_boss = GAME.Monsters.Create( GAME.data['enemy'], pos_evilboss.x, pos_evilboss.y );
		evil_boss.quest_evil_boss = true;
	GAME.Monsters.Create( 'revenant', 	pos_evilboss.x - 2, pos_evilboss.y - 2);
	GAME.Monsters.Create( 'revenant',	pos_evilboss.x + 2, pos_evilboss.y + 2);
	GAME.Monsters.Create( 'chocobone', 	pos_evilboss.x + 2, pos_evilboss.y - 2);
	GAME.Monsters.Create( 'chocobone', 	pos_evilboss.x - 2, pos_evilboss.y + 2);
	GAME.Monsters.Create( 'death_knight', 	pos_evilboss.x - 3, pos_evilboss.y );
	GAME.Monsters.Create( 'death_knight', 	pos_evilboss.x + 3, pos_evilboss.y );
	GAME.Monsters.Create( 'bone_shooter', 	pos_evilboss.x, pos_evilboss.y - 3);
	GAME.Monsters.Create( 'bone_shooter', 	pos_evilboss.x, pos_evilboss.y + 3);

	do {
		pos_orcboss = this.SearchRadius( $.gmRndInt(120,392), $.gmRndInt(120,392), [ 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
	} while ( this.IsQuestItemNearby(pos_orcboss.x, pos_orcboss.y) === true );
	GAME.data['position_orc_boss'] = pos_orcboss;
	this.ClearQuestPosition( pos_orcboss.x, pos_orcboss.y );
	var orc_boss = GAME.Monsters.Create( 'orc_sovereign', 	pos_orcboss.x, pos_orcboss.y );
		orc_boss.quest_orc_boss = true;
	GAME.Monsters.Create( 'orc_xbowman', 	pos_orcboss.x - 1, pos_orcboss.y - 1);
	GAME.Monsters.Create( 'orc_xbowman',	pos_orcboss.x + 1, pos_orcboss.y + 1);
	GAME.Monsters.Create( 'orc_archer', 	pos_orcboss.x + 1, pos_orcboss.y - 1);
	GAME.Monsters.Create( 'orc_assassin', 	pos_orcboss.x - 1, pos_orcboss.y + 1);
	GAME.Monsters.Create( 'orc_warrior', 	pos_orcboss.x - 2, pos_orcboss.y );
	GAME.Monsters.Create( 'orc_warrior', 	pos_orcboss.x + 2, pos_orcboss.y );
	GAME.Monsters.Create( 'orc_warrior', 	pos_orcboss.x, pos_orcboss.y - 2);
	GAME.Monsters.Create( 'orc_warrior', 	pos_orcboss.x, pos_orcboss.y + 2);

	if ( GAME.data['role'] === 'role_2_0' || GAME.data['role'] === 'role_2_1' ) {
		do {
			pos_unicorn = this.SearchRadius( $.gmRndInt(120,392), $.gmRndInt(120,392), [ 'swamp_shallow', 'swamp_deep', 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
		} while ( this.IsQuestItemNearby(pos_unicorn.x, pos_unicorn.y) === true );
		GAME.data['position_unicorn'] = pos_unicorn;
		this.ClearQuestPosition( pos_unicorn.x, pos_unicorn.y );
		var caged_unicorn = GAME.Monsters.Create( 'caged_unicorn', pos_unicorn.x, pos_unicorn.y );
			caged_unicorn.quest_caged_unicorn = true;
		GAME.Monsters.Create( 'orc_grunt', 	pos_unicorn.x - 1, pos_unicorn.y - 1);
		GAME.Monsters.Create( 'orc_grunt',	pos_unicorn.x + 1, pos_unicorn.y + 1);
		GAME.Monsters.Create( 'orc_archer', 	pos_unicorn.x + 1, pos_unicorn.y - 1);
		GAME.Monsters.Create( 'orc_archer', 	pos_unicorn.x - 1, pos_unicorn.y + 1);
		GAME.Monsters.Create( 'goblin', 	pos_unicorn.x - 2, pos_unicorn.y );
		GAME.Monsters.Create( 'goblin', 	pos_unicorn.x + 2, pos_unicorn.y );
		GAME.Monsters.Create( 'goblin', 	pos_unicorn.x, pos_unicorn.y - 2);
		GAME.Monsters.Create( 'goblin', 	pos_unicorn.x, pos_unicorn.y + 2);
	}

	if ( GAME.data['role'].startsWith('role_4') === true ) {
		do {
			pos_fugitive = this.SearchRadius( $.gmRndInt(120,392), $.gmRndInt(120,392), [ 'swamp_shallow', 'swamp_deep', 'grass', 'grass_pale', 'mud', 'dirt', 'soil', 'snow' ] );
		} while ( this.IsQuestItemNearby(pos_fugitive.x, pos_fugitive.y) === true );
		GAME.data['position_fugitive'] = pos_fugitive;
		this.ClearQuestPosition( pos_fugitive.x, pos_fugitive.y, -1, 1 );
		var fugitive = GAME.Monsters.Create( 'fugitive', pos_fugitive.x, pos_fugitive.y );
			fugitive.quest_fugitive = true;
		GAME.Monsters.Create( 'outlaw', pos_fugitive.x - 1, pos_fugitive.y - 1);
		GAME.Monsters.Create( 'outlaw', pos_fugitive.x + 1, pos_fugitive.y + 1);
	}

	// Log:
//	console.log( 'evil boss:' + pos_evilboss.x + ',' + pos_evilboss.y );
//	console.log( 'orc boss:' + pos_orcboss.x + ',' + pos_orcboss.y );
//	if ( GAME.data['role'] === 'role_2_0' || GAME.data['role'] === 'role_2_1' ) {
//		console.log( 'unicorn:' + pos_unicorn.x + ',' + pos_unicorn.y );
//	}

};

GAME.MapGen.GetClosestDistance = function(container, x, y) {
	var dist = 1000000., curdist;
	for (var i = 0; i < container.length; i++) {
		curdist = Math.sqrt( Math.pow(x - container[i][0],2) + Math.pow(y - container[i][1],2) );
		if (curdist < dist) {
			dist = curdist;
		}
	}
	return dist;
};

GAME.MapGen.IsObjectNearby = function(x, y) {
	var o = this.mTerrainMap;
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			if ( i == 0 && j == 0 ) { continue; }
			if ( o[x+i] != undefined && o[x+i][y+j] != undefined ) { return true; }
		}
	}
	return false;
};

GAME.MapGen.IsObjectNearbyStartsWith = function(x, y, name) {
	var o = this.mTerrainMap;
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			if ( i == 0 && j == 0 ) { continue; }
			if ( o[x+i][y+j] != undefined && o[x+i][y+j].t.startsWith(name) ) { return true; }
		}
	}
	return false;
};

GAME.MapGen.IsTileTypeNearby = function(x, y, type) { // type = ['water','sand']
	var o = this.mTileMap;
	for ( i = -1; i <= 1; i++ ) {
		for ( j = -1; j <= 1; j++ ) {
			if ( i == 0 && j == 0 ) { continue; }
			if ( o[x+i][y+j] != undefined && type.inArray( o[x+i][y+j] ) ) { return true; }
		}
	}
	return false;
};

GAME.MapGen.FloodFill = function(container, x, y, old_color, new_color) {
    var dx = [ 0, -1, +1, 0], dy = [-1, 0, 0, +1], stack = [];
    stack.push(x);
    stack.push(y);
    while (stack.length > 0) {
        var curPointY = stack.pop();
        var curPointX = stack.pop();
        for (var i = 0; i < 4; i++) {
            var nextPointX = curPointX + dx[i];
            var nextPointY = curPointY + dy[i];
            if (nextPointX < 0 || nextPointY < 0 || nextPointX > this.mDX || nextPointY > this.mDY) { continue; }
            var nextPointOffset = nextPointY * this.mDX + nextPointX;
            if (container[nextPointOffset] == old_color) {
                container[nextPointOffset] = new_color;
                stack.push(nextPointX);
                stack.push(nextPointY);
            }
        }
    }
    return this;
};

GAME.MapGen.CheckLos = function( x0, y0, x1, y1 ) {
    var dx = Math.abs(x1 - x0),
        dy = Math.abs(y1 - y0),
        sx = x0 < x1 ? 1 : 0 - 1,
        sy = y0 < y1 ? 1 : 0 - 1,
        err = dx - dy;
    var obj = this.mTerrainMap;
	var go = GAME.Objects;
    while (true) {
        if (x0 === x1 && y0 === y1) { break; }
        if ( obj[x0][y0] != undefined && go.Get( obj[x0][y0].t ).nolos === true ) { return false; }
        var e2 = 2 * err;
        if (e2 > 0 - dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return true;
};


