
GAME.Objects = GAME.Objects || { REVISION: '1' };

GAME.Objects.GetAtXY = function( game_x, game_y ) {
	return GAME.MapGen.mObjMap[ game_x ][ game_y ];
};

GAME.Objects.GetTerrainAtXY = function( game_x, game_y ) {
	return GAME.MapGen.mTerrainMap[ game_x ][ game_y ];
};

GAME.Objects.Get = function( name ) {
	if ( this.mObjs[name] !== undefined ) {
		return this.mObjs[name];
	} else if ( this.mTerrains[name] !== undefined ) {
		return this.mTerrains[name];
	}
	return undefined;
};

GAME.Objects.CreateRandomSpellObject = function( x, y ) {
	var objs = ['bonus_potion_blue', 'bonus_potion_green', 'bonus_potion_gray', 'bonus_potion_heal',
		'bonus_scroll_blue','bonus_scroll_yellow','bonus_scroll_green','bonus_scroll_cyan',
		'bonus_scroll_purple','bonus_scroll_red', 'bonus_scroll_orange','bonus_scroll_black' ];
	objs = $.gmShuffleArray(objs);
	this.CreateAt( objs.pop(), x, y );
};

GAME.Objects.Create = function( name ) {
	var len = -1;
	if ( this.mTerrains[name] !== undefined ) {
		len = $.gmRndInt( 0, this.mTerrains[name].length - 1 );
	} else if ( this.mObjs[name] !== undefined ) {
		len = $.gmRndInt( 0, this.mObjs[name].length - 1 );
	}
	if ( len !== -1 ) { return { 't': name, 'v': len }; }
	console.log('undefined object: ' + name );
	return undefined;
};

GAME.Objects.CreateAt = function( name, game_x, game_y ) {
	var obj = this.Create( name );
	if ( obj.t === 'blood' ) {
		GAME.MapGen.mBloodMap[game_x][game_y] = obj;
	} else if ( this.mObjs[name] !== undefined ) {
		GAME.MapGen.mObjMap[game_x][game_y] = obj;
	} else if ( this.mTerrains[name] !== undefined ) {
		GAME.MapGen.mTerrainMap[game_x][game_y] = obj;
	} else {
		console.log('dont know how to create object: ' + name);
	}
	return obj;
};

GAME.Objects.Destroy = function( game_x, game_y ) {
	GAME.MapGen.mObjMap[game_x][game_y] = undefined;
};

GAME.Objects.DestroyTerrain = function( game_x, game_y ) {
	GAME.MapGen.mTerrainMap[game_x][game_y] = undefined;
};

GAME.Objects.mTerrains = {
    'blood' 			: { tileset: 'tilesets', xoff: 6, yoff: 0, length: 4, nolos: false },
    'forest_oasis' 			: { tileset: 'tilesets', xoff: 6, yoff: 10, length: 3, nolos: false },
    'deco_debris' 			: { tileset: 'tilesets', xoff: 6, yoff: 11, length: 4, nolos: false },
    'forest_palm' 			: { tileset: 'tilesets', xoff: 6, yoff:  9, length: 4, nolos: true },
    'forest_palm_desert' 	: { tileset: 'tilesets', xoff: 6, yoff:  22, length: 4, nolos: true },
    'forest_deducious' 		: { tileset: 'tilesets', color: [14,84,30], xoff: 6, yoff: 15, length: 4, nolos: true },
    'forest_coniferous' 	: { tileset: 'tilesets', color: [14,84,30], xoff: 6, yoff: 16, length: 4, nolos: true },
    'deco_flowers' 			: { tileset: 'tilesets', xoff: 6, yoff: 17, length: 4, nolos: false },
    'deco_swamp_lilies'		: { tileset: 'tilesets', xoff: 6, yoff: 26, length: 4, nolos: false },
    'deco_swamp_lilies_flowers' : { tileset: 'tilesets', xoff: 6, yoff: 25, length: 4, nolos: false },
    'deco_swamp_grass' 		: { tileset: 'tilesets', xoff: 6, yoff: 24, length: 4, nolos: false },
    'bonus_mushrooms_large' : { tileset: 'tilesets', xoff: 6, yoff: 30, length: 4, nolos: false },
    'mountains' 			: { tileset: 'tilesets', color: [144,144,144], xoff: 6, yoff: 39, length: 4, nolos: true },
    'deco_stones' 			: { tileset: 'tilesets', xoff: 6, yoff: 14, length: 4, nolos: false },
    'deco_stones_small' 	: { tileset: 'tilesets', xoff: 6, yoff: 12, length: 4, nolos: false },
    'bonus_mushrooms' 		: { tileset: 'tilesets', xoff: 6, yoff: 13, length: 4, nolos: false },
    'stones_large' 		: { tileset: 'tilesets', color: [90,90,90], xoff: 6, yoff: 40, length: 4, nolos: true },
    'monolith' 			: { tileset: 'tilesets', color: [90,90,90], xoff: 6, yoff: 41, length: 4, nolos: true },
    'forest_snow_coniferous' : { tileset: 'tilesets', xoff: 6, yoff: 42, length: 4, nolos: true },
    'forest_snow_dead' 	: { tileset: 'tilesets', xoff: 6, yoff: 43, length: 4, nolos: true },
    'forest_autumn' 	: { tileset: 'tilesets', xoff: 6, yoff: 44, length: 4, nolos: true },
    'reef' 				: { tileset: 'tilesets', xoff: 6, yoff: 6, length: 4, nolos: false },
    'sunken_huts' 		: { tileset: 'tilesets', xoff: 6, yoff: 7, length: 4, nolos: true },
    'whirlpool' 		: { tileset: 'tilesets', xoff: 6, yoff: 3, length: 1, nolos: false },
    'deco_bones' 		: { tileset: 'tilesets', xoff: 9, yoff: 4, length: 1, nolos: false },
    'deco_bones_bow' 	: { tileset: 'tilesets', xoff: 6, yoff: 5, length: 1, nolos: false },
    'deco_ship' 		: { tileset: 'tilesets', xoff: 7, yoff: 8, length: 3, nolos: false },
    'house_human_hut' 	: { tileset: 'tilesets', xoff: 8, yoff: 36, length: 2, nolos: false },
    'house_human_castle': { tileset: 'tilesets', xoff: 6, yoff: 36, length: 2, nolos: false },
    'house_dwarf' 		: { tileset: 'tilesets', xoff: 6, yoff: 37, length: 4, nolos: false },
    'house_elf' 		: { tileset: 'tilesets', xoff: 6, yoff: 38, length: 2, nolos: false },
	'house_elf_lights'	: { tileset: 'tilesets', xoff: 7, yoff:  5, length: 3, nolos: false },
    'house_desert'		: { tileset: 'tilesets', xoff: 8, yoff: 38, length: 2, nolos: false },
    'house_orc' 		: { tileset: 'tilesets', xoff: 6, yoff: 47, length: 4, nolos: false },
    'house_stone' 		: { tileset: 'tilesets', xoff: 6, yoff: 46, length: 3, nolos: false },
    'house_swamp' 		: { tileset: 'tilesets', xoff: 9, yoff: 46, length: 1, nolos: false },
    'house_tent' 		: { tileset: 'tilesets', xoff: 8, yoff: 45, length: 2, nolos: false },
    'house_simple' 		: { tileset: 'tilesets', xoff: 6, yoff: 45, length: 1, nolos: false },
    'house_wooden' 		: { tileset: 'tilesets', xoff: 7, yoff: 45, length: 1, nolos: false },
    'mine' 				: { tileset: 'tilesets', xoff: 8, yoff: 31, length: 2, nolos: false },
    'trapdoor_open' 	: { tileset: 'tilesets', xoff: 6, yoff: 31, length: 1, nolos: false },
    'trapdoor_closed' 	: { tileset: 'tilesets', xoff: 7, yoff: 31, length: 1, nolos: false },
    'lighthouse' 		: { tileset: 'tilesets', xoff: 8, yoff: 32, length: 1, nolos: true  },
    'spiked_heads' 		: { tileset: 'tilesets', xoff: 7, yoff: 32, length: 1, nolos: false },
    'skeleton' 			: { tileset: 'tilesets', xoff: 6, yoff: 32, length: 1, nolos: false },
	'bonus_orc_tower'	: { tileset: 'tilesets', xoff: 7, yoff: 4, length: 1, nolos: false },
	'shop_magic'		: { tileset: 'tilesets', xoff: 0, yoff: 49, length: 1, nolos: false },
	'shop_weapons'		: { tileset: 'tilesets', xoff: 2, yoff: 49, length: 1, nolos: false },
	'castle_tl'			: { tileset: 'castle', xoff: 0, yoff: 0, length: 1, nolos: true },
	'castle_t'			: { tileset: 'castle', xoff: 1, yoff: 0, length: 1, nolos: true },
	'castle_tr'			: { tileset: 'castle', xoff: 2, yoff: 0, length: 1, nolos: true },
	'castle_l'			: { tileset: 'castle', xoff: 0, yoff: 1, length: 1, nolos: true },
	'castle_c'			: { tileset: 'castle', xoff: 1, yoff: 1, length: 1, nolos: false },
	'castle_r'			: { tileset: 'castle', xoff: 2, yoff: 1, length: 1, nolos: true },
	'castle_bl'			: { tileset: 'castle', xoff: 0, yoff: 2, length: 1, nolos: true },
	'castle_b'			: { tileset: 'castle', xoff: 1, yoff: 2, length: 1, nolos: false },
	'castle_br'			: { tileset: 'castle', xoff: 2, yoff: 2, length: 1, nolos: true }

};

GAME.Objects.mObjs = {
    'bonus_barrel_floating' : { tileset: 'tilesets', xoff: 6, yoff:  4, length: 1, nolos: false },
    'bonus_barrel_open' 	: { tileset: 'tilesets', xoff: 6, yoff: 18, length: 1, nolos: false },
    'bonus_barrel_closed' 	: { tileset: 'tilesets', xoff: 7, yoff: 18, length: 2, nolos: false },
    'bonus_barrel_dark' 	: { tileset: 'tilesets', xoff:10, yoff: 18, length: 1, nolos: false },
    'bonus_crate_open' 		: { tileset: 'tilesets', xoff: 7, yoff: 20, length: 1, nolos: false },
    'bonus_crate_closed' 	: { tileset: 'tilesets', xoff: 8, yoff: 20, length: 1, nolos: false },
    'bonus_chest_gold' 		: { tileset: 'tilesets', xoff: 6, yoff: 20, length: 1, nolos: false },
    'bonus_gold_small' 		: { tileset: 'tilesets', xoff: 7, yoff: 19, length: 1, nolos: false },
    'bonus_gold_medium' 	: { tileset: 'tilesets', xoff: 8, yoff: 19, length: 1, nolos: false },
    'bonus_gold_large' 		: { tileset: 'tilesets', xoff: 8, yoff: 19, length: 1, nolos: false },

    'bonus_potion_health' 	: { tileset: 'tilesets', xoff: 8, yoff: 27, length: 1, nolos: false },
    'bonus_potion_youth' 	: { tileset: 'tilesets', xoff: 9, yoff: 27, length: 1, nolos: false },
    'bonus_potion_poison' 	: { tileset: 'tilesets', xoff: 7, yoff: 28, length: 1, nolos: false },

    'bonus_potion_heal' 	: { tileset: 'tilesets', xoff: 8, yoff: 28, length: 1, nolos: false },
    'bonus_potion_blue' 	: { tileset: 'tilesets', xoff: 6, yoff: 27, length: 1, nolos: false }, // Fly
    'bonus_potion_green' 	: { tileset: 'tilesets', xoff: 7, yoff: 27, length: 1, nolos: false }, // Mirror Image
	'bonus_potion_gray' 	: { tileset: 'tilesets', xoff: 6, yoff: 28, length: 1, nolos: false }, // Shadows 

	'bonus_scroll_blue'		: { tileset: 'tilesets', xoff: 4, yoff: 49, length: 1, nolos: false }, // rain = sand
	'bonus_scroll_yellow'	: { tileset: 'tilesets', xoff: 5, yoff: 49, length: 1, nolos: false }, // frenzy = swamp / desert
	'bonus_scroll_green'	: { tileset: 'tilesets', xoff: 6, yoff: 49, length: 1, nolos: false }, // forest
	'bonus_scroll_cyan'		: { tileset: 'tilesets', xoff: 7, yoff: 49, length: 1, nolos: false }, // tornado = desert
	'bonus_scroll_purple'	: { tileset: 'tilesets', xoff: 8, yoff: 49, length: 1, nolos: false }, // sleep = grass
	'bonus_scroll_red'		: { tileset: 'tilesets', xoff: 9, yoff: 49, length: 1, nolos: false }, // charm = grass
	'bonus_scroll_orange'	: { tileset: 'tilesets', xoff: 0, yoff: 50, length: 1, nolos: false }, // entangle
	'bonus_scroll_black'	: { tileset: 'tilesets', xoff: 1, yoff: 50, length: 1, nolos: false }, // frenzy

    'bonus_book' 			: { tileset: 'tilesets', xoff: 6, yoff: 29, length: 4, nolos: false },
    'bonus_book_necro' 		: { tileset: 'tilesets', xoff: 9, yoff: 28, length: 1, nolos: false },
    'bonus_sword' 			: { tileset: 'tilesets', xoff: 6, yoff: 33, length: 1, nolos: false },
    'bonus_lance' 			: { tileset: 'tilesets', xoff: 9, yoff: 33, length: 1, nolos: false },
    'bonus_bow' 			: { tileset: 'tilesets', xoff: 6, yoff: 34, length: 3, nolos: false },
    'bonus_axe' 			: { tileset: 'tilesets', xoff: 9, yoff: 34, length: 1, nolos: false },
    'bonus_staff' 			: { tileset: 'tilesets', xoff: 6, yoff: 35, length: 2, nolos: false },
    'bonus_armor' 			: { tileset: 'tilesets', xoff: 8, yoff: 35, length: 1, nolos: false },
    'bonus_armor_gold' 		: { tileset: 'tilesets', xoff: 9, yoff: 35, length: 1, nolos: false },
    'bonus_holy_hammer' 	: { tileset: 'tilesets', xoff: 7, yoff: 23, length: 1, nolos: false },
    'bonus_key' 			: { tileset: 'tilesets', xoff: 9, yoff: 23, length: 1, nolos: false },
    'bonus_ankh' 			: { tileset: 'tilesets', xoff: 8, yoff: 23, length: 1, nolos: false },
    'bonus_necklace' 		: { tileset: 'tilesets', xoff: 6, yoff: 21, length: 1, nolos: false },
    'bonus_flamingsword' 	: { tileset: 'tilesets', xoff: 7, yoff: 33, length: 1, nolos: false },
    'bonus_book_postament' 	: { tileset: 'tilesets', xoff: 7, yoff: 21, length: 1, nolos: false }
};
