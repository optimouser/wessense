
GAME.Tiles = GAME.Tiles || { REVISION: '1' };

GAME.Tiles.GetAtXY = function( x, y ) {
	return GAME.MapGen.mTileMap[x][y];
};

GAME.Tiles.SetAtXY = function( tile, x, y ) {
	GAME.MapGen.mTileMap[x][y] = tile;
};

GAME.Tiles.Get = function( name ) {
	return this.mTiles[name];
};

GAME.Tiles.mTiles = {
	'water_deep'		: { offset: 0,	tileset: 'tilesets1',	order: 0,	color: [10,105,201],	penalty: -100 }, 
	'water_medium'		: { offset: 1,	tileset: 'tilesets1',	order: 10,	color: [12,128,247],	penalty:  -50 }, 
	'water_shallow'		: { offset: 2,	tileset: 'tilesets1',	order: 30,	color: [97,174,254],	penalty:  -30 }, 
	'sand'				: { offset: 3,	tileset: 'tilesets1',	order: 20,	color: [221,203,117],	penalty:  -20 }, 
	'dirt'				: { offset: 4,	tileset: 'tilesets1',	order: 40,	color: [179,130,51],	penalty:  -10 }, 
	'grass'				: { offset: 5,	tileset: 'tilesets1',	order: 50,	color: [61,97,10],		penalty:    0 }, 
	'grass_pale'		: { offset: 6,	tileset: 'tilesets1',	order: 60,	color: [61,97,10],		penalty:    0 }, 
	'desert'			: { offset: 7,	tileset: 'tilesets1',	order: 70,	color: [224,222,68],	penalty:  -20 }, 
	'swamp_shallow'		: { offset: 8,	tileset: 'tilesets1',	order: 80,	color: [36,55,33],		penalty:  -20 }, 
	'swamp_deep'		: { offset: 9,	tileset: 'tilesets1',	order: 90,	color: [36,55,33],		penalty:  -30 }, 
	'cobblestone'		: { offset: 10,	tileset: 'tilesets1',	order: 100,	color: [139,90,27],		penalty:    0 }, 
	'cobblestone_green'	: { offset: 11,	tileset: 'tilesets1',	order: 110,	color: [139,90,27],		penalty:    0 }, 
	'lava'				: { offset: 12,	tileset: 'tilesets1',	order: 120,	color: [255,0,0],		penalty:  -50 }, 
	'soil'				: { offset: 13,	tileset: 'tilesets1',	order: 130,	color: [115,80,0],		penalty:    0 }, 
	'snow'				: { offset: 14,	tileset: 'tilesets1',	order: 140,	color: [250,250,250],	penalty:  -20 }, 
	'mud'				: { offset: 15,	tileset: 'tilesets1',	order: 150,	color: [114,112,100],	penalty:  -10 } 
};

